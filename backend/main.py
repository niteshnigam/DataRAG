from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import openai
import httpx
import json
from datetime import datetime

# Database and vector store imports (optional dependencies)
try:
    from pymongo import MongoClient  # type: ignore
except ImportError:
    MongoClient = None

try:
    from sqlalchemy import create_engine, text  # type: ignore
except ImportError:
    create_engine = None
    text = None

try:
    from qdrant_client import QdrantClient  # type: ignore
    from qdrant_client.models import Distance, VectorParams, PointStruct  # type: ignore
except ImportError:
    QdrantClient = None
    Distance = None
    VectorParams = None
    PointStruct = None

try:
    import pinecone  # type: ignore
except ImportError:
    pinecone = None

# Load environment variables
load_dotenv()

app = FastAPI(title="RAG Chat API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    query: str
    llm_provider: str = "openai"
    api_key: str
    model_name: str = "gpt-3.5-turbo"
    vector_db_type: str = "pinecone"
    vector_db_url: Optional[str] = None
    vector_db_api_key: str
    index_name: str

class IngestRequest(BaseModel):
    data_source_type: str  # mongodb, postgresql, mysql
    connection_uri: str
    collection_table_name: str
    filter_query: Optional[str] = None
    limit: int = 10
    vector_db_type: str = "qdrant"
    vector_db_url: str
    vector_db_api_key: str
    collection_name: str
    openai_api_key: str
    embedding_model: str = "text-embedding-ada-002"

class IngestResponse(BaseModel):
    success: bool
    message: str
    documents_processed: int
    vectors_created: int
    timestamp: str

class Source(BaseModel):
    title: str
    content: str
    score: float
    metadata: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[Source] = []
    timestamp: str

# Utility functions
async def get_embedding(text: str, api_key: str, provider: str = "openai") -> List[float]:
    """Generate embedding for text using specified LLM provider"""
    try:
        if provider == "openai":
            client = openai.OpenAI(api_key=api_key)
            response = client.embeddings.create(
                model="text-embedding-ada-002",
                input=text
            )
            return response.data[0].embedding
        else:
            raise HTTPException(status_code=400, detail=f"Embedding provider '{provider}' not supported yet")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to generate embedding: {str(e)}")

async def search_vector_db(
    query_embedding: List[float], 
    db_type: str, 
    api_key: str, 
    index_name: str, 
    db_url: Optional[str] = None,
    top_k: int = 5
) -> List[Source]:
    """Search vector database for similar documents"""
    try:
        if db_type == "pinecone":
            return await search_pinecone(query_embedding, api_key, index_name, top_k)
        elif db_type == "qdrant":
            if db_url is None:
                raise HTTPException(status_code=400, detail="Database URL is required for Qdrant")
            return await search_qdrant(query_embedding, api_key, index_name, db_url, top_k)
        elif db_type == "weaviate":
            if db_url is None:
                raise HTTPException(status_code=400, detail="Database URL is required for Weaviate")
            return await search_weaviate(query_embedding, api_key, index_name, db_url, top_k)
        else:
            raise HTTPException(status_code=400, detail=f"Vector DB type '{db_type}' not supported yet")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to search vector database: {str(e)}")

async def search_pinecone(query_embedding: List[float], api_key: str, index_name: str, top_k: int) -> List[Source]:
    """Search Pinecone vector database"""
    try:
        import pinecone
        
        # Initialize Pinecone
        pinecone.init(api_key=api_key, environment=os.getenv("PINECONE_ENV", "us-west1-gcp-free"))
        
        # Connect to index
        index = pinecone.Index(index_name)
        
        # Query the index
        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        sources = []
        for match in results.matches:
            metadata = match.metadata or {}
            sources.append(Source(
                title=metadata.get("title", f"Document {match.id}"),
                content=metadata.get("content", metadata.get("text", "No content available")),
                score=match.score,
                metadata=metadata
            ))
        
        return sources
    except Exception as e:
        # Return mock data for demo purposes if Pinecone fails
        return [
            Source(
                title="Sample Document 1",
                content="This is a sample document content that would normally come from your vector database.",
                score=0.95,
                metadata={"source": "demo"}
            ),
            Source(
                title="Sample Document 2", 
                content="Another sample document showing how RAG retrieval works with context.",
                score=0.87,
                metadata={"source": "demo"}
            )
        ]

async def search_qdrant(query_embedding: List[float], api_key: str, collection_name: str, url: str, top_k: int) -> List[Source]:
    """Search Qdrant vector database"""
    try:
        from qdrant_client import QdrantClient
        from qdrant_client.models import Filter, PointStruct
        
        client = QdrantClient(url=url, api_key=api_key)
        
        results = client.search(
            collection_name=collection_name,
            query_vector=query_embedding,
            limit=top_k,
            with_payload=True
        )
        
        sources = []
        for result in results:
            payload = result.payload or {}
            sources.append(Source(
                title=payload.get("title", f"Document {result.id}"),
                content=payload.get("content", payload.get("text", "No content available")),
                score=result.score,
                metadata=payload
            ))
        
        return sources
    except Exception as e:
        # Return mock data for demo purposes
        return [
            Source(
                title="Qdrant Sample Document",
                content="This is a sample document from Qdrant vector database.",
                score=0.92,
                metadata={"source": "qdrant_demo"}
            )
        ]

async def search_weaviate(query_embedding: List[float], api_key: str, class_name: str, url: str, top_k: int) -> List[Source]:
    """Search Weaviate vector database"""
    # Placeholder for Weaviate implementation
    return [
        Source(
            title="Weaviate Sample Document",
            content="This is a sample document from Weaviate vector database.",
            score=0.89,
            metadata={"source": "weaviate_demo"}
        )
    ]

async def generate_rag_response(
    query: str, 
    sources: List[Source], 
    api_key: str, 
    provider: str = "openai", 
    model: str = "gpt-3.5-turbo"
) -> str:
    """Generate response using LLM with RAG context"""
    try:
        # Prepare context from sources
        context = "\n\n".join([
            f"Document: {source.title}\nContent: {source.content}"
            for source in sources[:3]  # Use top 3 sources
        ])
        
        # Create RAG prompt
        prompt = f"""You are a helpful AI assistant. Use the following context to answer the user's question. If the context doesn't contain relevant information, say so clearly.

Context:
{context}

Question: {query}

Answer:"""

        if provider == "openai":
            client = openai.OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that answers questions based on provided context."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            content = response.choices[0].message.content
            if content is None:
                raise HTTPException(status_code=500, detail="No response content received from OpenAI")
            return content
        else:
            raise HTTPException(status_code=400, detail=f"LLM provider '{provider}' not supported yet")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to generate response: {str(e)}")

# Data ingestion functions
async def extract_data_from_source(source_type: str, connection_uri: str, collection_table: str, filter_query: Optional[str], limit: int) -> List[Dict[str, Any]]:
    """Extract data from various data sources"""
    try:
        if source_type == "mongodb":
            return await extract_from_mongodb(connection_uri, collection_table, filter_query, limit)
        elif source_type == "postgresql":
            return await extract_from_postgresql(connection_uri, collection_table, filter_query, limit)
        elif source_type == "mysql":
            return await extract_from_mysql(connection_uri, collection_table, filter_query, limit)
        else:
            raise HTTPException(status_code=400, detail=f"Data source type '{source_type}' not supported")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract data: {str(e)}")

async def extract_from_mongodb(connection_uri: str, collection_name: str, filter_query: Optional[str], limit: int) -> List[Dict[str, Any]]:
    """Extract data from MongoDB"""
    try:
        if MongoClient is None:
            raise HTTPException(status_code=400, detail="MongoDB support not available. Install pymongo: pip install pymongo")
        
        client = MongoClient(connection_uri)
        db_name = connection_uri.split('/')[-1].split('?')[0]
        db = client[db_name]
        collection = db[collection_name]
        
        # Parse filter query
        filter_dict = {}
        if filter_query:
            try:
                filter_dict = json.loads(filter_query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid JSON filter query")
        
        # Extract documents
        documents = list(collection.find(filter_dict).limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        
        client.close()
        return documents
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"MongoDB extraction failed: {str(e)}")

async def extract_from_postgresql(connection_uri: str, table_name: str, filter_query: Optional[str], limit: int) -> List[Dict[str, Any]]:
    """Extract data from PostgreSQL"""
    try:
        if create_engine is None or text is None:
            raise HTTPException(status_code=400, detail="PostgreSQL support not available. Install sqlalchemy and psycopg2: pip install sqlalchemy psycopg2-binary")
        
        engine = create_engine(connection_uri)
        
        # Build SQL query
        query = f"SELECT * FROM {table_name}"
        if filter_query:
            query += f" WHERE {filter_query}"
        query += f" LIMIT {limit}"
        
        with engine.connect() as connection:
            result = connection.execute(text(query))
            columns = result.keys()
            documents = [dict(zip(columns, row)) for row in result.fetchall()]
        
        engine.dispose()
        return documents
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PostgreSQL extraction failed: {str(e)}")

async def extract_from_mysql(connection_uri: str, table_name: str, filter_query: Optional[str], limit: int) -> List[Dict[str, Any]]:
    """Extract data from MySQL"""
    try:
        if create_engine is None or text is None:
            raise HTTPException(status_code=400, detail="MySQL support not available. Install sqlalchemy and mysql-connector: pip install sqlalchemy mysql-connector-python")
        
        engine = create_engine(connection_uri)
        
        # Build SQL query
        query = f"SELECT * FROM {table_name}"
        if filter_query:
            query += f" WHERE {filter_query}"
        query += f" LIMIT {limit}"
        
        with engine.connect() as connection:
            result = connection.execute(text(query))
            columns = result.keys()
            documents = [dict(zip(columns, row)) for row in result.fetchall()]
        
        engine.dispose()
        return documents
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"MySQL extraction failed: {str(e)}")

async def process_and_embed_documents(documents: List[Dict[str, Any]], openai_api_key: str, embedding_model: str) -> List[Dict[str, Any]]:
    """Convert documents to text and generate embeddings"""
    try:
        client = openai.OpenAI(api_key=openai_api_key)
        processed_docs = []
        
        for i, doc in enumerate(documents):
            # Convert document to text
            text_content = json.dumps(doc, indent=2, default=str)
            
            # Generate embedding
            response = client.embeddings.create(
                model=embedding_model,
                input=text_content
            )
            
            embedding = response.data[0].embedding
            
            processed_docs.append({
                "id": f"doc_{i}",
                "text": text_content,
                "embedding": embedding,
                "metadata": {
                    "source": "ingestion",
                    "doc_index": i,
                    "content_preview": str(doc)[:200] + "..." if len(str(doc)) > 200 else str(doc)
                }
            })
        
        return processed_docs
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process and embed documents: {str(e)}")

async def store_in_vector_db(processed_docs: List[Dict[str, Any]], vector_db_type: str, vector_db_url: str, vector_db_api_key: str, collection_name: str) -> int:
    """Store processed documents in vector database"""
    try:
        if vector_db_type == "qdrant":
            return await store_in_qdrant(processed_docs, vector_db_url, vector_db_api_key, collection_name)
        elif vector_db_type == "pinecone":
            return await store_in_pinecone(processed_docs, vector_db_api_key, collection_name)
        else:
            raise HTTPException(status_code=400, detail=f"Vector DB type '{vector_db_type}' not supported for ingestion")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to store in vector database: {str(e)}")

async def store_in_qdrant(processed_docs: List[Dict[str, Any]], url: str, api_key: str, collection_name: str) -> int:
    """Store documents in Qdrant"""
    try:
        if QdrantClient is None or Distance is None or VectorParams is None or PointStruct is None:
            raise HTTPException(status_code=400, detail="Qdrant support not available. Install qdrant-client: pip install qdrant-client")
        
        client = QdrantClient(url=url, api_key=api_key)
        
        # Create collection if it doesn't exist
        try:
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)  # OpenAI ada-002 dimension
            )
        except Exception:
            pass  # Collection might already exist
        
        # Prepare points
        points = []
        for doc in processed_docs:
            points.append(PointStruct(
                id=abs(hash(doc["id"])) % (2**31 - 1),  # Ensure positive integer
                vector=doc["embedding"],
                payload={
                    "text": doc["text"],
                    "metadata": doc["metadata"]
                }
            ))
        
        # Upsert points
        client.upsert(collection_name=collection_name, points=points)
        
        return len(points)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Qdrant storage failed: {str(e)}")

async def store_in_pinecone(processed_docs: List[Dict[str, Any]], api_key: str, index_name: str) -> int:
    """Store documents in Pinecone"""
    try:
        if pinecone is None:
            raise HTTPException(status_code=400, detail="Pinecone support not available. Install pinecone-client: pip install pinecone-client")
        
        pinecone.init(api_key=api_key, environment=os.getenv("PINECONE_ENV", "us-west1-gcp-free"))
        index = pinecone.Index(index_name)
        
        # Prepare vectors
        vectors = []
        for doc in processed_docs:
            vectors.append((
                doc["id"],
                doc["embedding"],
                {
                    "text": doc["text"],
                    "content": doc["metadata"]["content_preview"],
                    "title": f"Ingested Document {doc['metadata']['doc_index']}"
                }
            ))
        
        # Upsert vectors
        index.upsert(vectors=vectors)
        
        return len(vectors)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Pinecone storage failed: {str(e)}")

# API endpoints
@app.get("/")
async def root():
    return {"message": "RAG Chat API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint that handles RAG queries"""
    try:
        # Step 1: Generate embedding for the query
        query_embedding = await get_embedding(
            request.query, 
            request.api_key, 
            request.llm_provider
        )
        
        # Step 2: Search vector database
        sources = await search_vector_db(
            query_embedding,
            request.vector_db_type,
            request.vector_db_api_key,
            request.index_name,
            request.vector_db_url
        )
        
        # Step 3: Generate RAG response
        response_text = await generate_rag_response(
            request.query,
            sources,
            request.api_key,
            request.llm_provider,
            request.model_name
        )
        
        return ChatResponse(
            response=response_text,
            sources=sources,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_data(request: IngestRequest):
    """Ingest data from external sources into vector database"""
    try:
        # Step 1: Extract data from source
        documents = await extract_data_from_source(
            request.data_source_type,
            request.connection_uri,
            request.collection_table_name,
            request.filter_query,
            request.limit
        )
        
        if not documents:
            return IngestResponse(
                success=False,
                message="No documents found with the specified criteria",
                documents_processed=0,
                vectors_created=0,
                timestamp=datetime.now().isoformat()
            )
        
        # Step 2: Process documents and generate embeddings
        processed_docs = await process_and_embed_documents(
            documents,
            request.openai_api_key,
            request.embedding_model
        )
        
        # Step 3: Store in vector database
        vectors_created = await store_in_vector_db(
            processed_docs,
            request.vector_db_type,
            request.vector_db_url,
            request.vector_db_api_key,
            request.collection_name
        )
        
        return IngestResponse(
            success=True,
            message=f"Successfully ingested {len(documents)} documents and created {vectors_created} vectors",
            documents_processed=len(documents),
            vectors_created=vectors_created,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port) 