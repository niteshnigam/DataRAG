# 🤖 RAG Chat Platform

A full-stack intelligent document search and chat platform that combines **Retrieval-Augmented Generation (RAG)** with modern web technologies. Chat with your documents using state-of-the-art language models and vector databases.

![RAG Chat Platform](https://img.shields.io/badge/RAG-Chat%20Platform-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-blue)

## 🚀 Project Description

This platform enables users to have intelligent conversations with their document collections by:

- **Embedding user queries** using advanced language models (OpenAI, Anthropic, etc.)
- **Searching vector databases** (Pinecone, Qdrant, Weaviate) for relevant document chunks
- **Generating contextual responses** using retrieved information and large language models
- **Providing source citations** for transparency and verification

Perfect for document analysis, research assistance, knowledge base querying, and intelligent information retrieval.

## 🔧 Tech Stack

### Frontend
- **React 18.2** - Modern UI library with hooks
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **FastAPI 0.104** - High-performance Python web framework
- **Pydantic 2.5** - Data validation using Python type hints
- **OpenAI SDK** - Integration with OpenAI models and embeddings
- **Vector Database Clients** - Pinecone, Qdrant, and Weaviate support

### Infrastructure
- **CORS Middleware** - Cross-origin resource sharing
- **Environment Variables** - Secure configuration management
- **RESTful API** - Clean, predictable API design

## 📦 Project Structure

```
rag-chat-platform/
├── frontend/                 # React + Tailwind UI
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── SettingsForm.js    # Configuration form
│   │   │   └── ChatInterface.js   # Chat UI
│   │   ├── App.js          # Main application
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
├── backend/                  # FastAPI backend with RAG
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
├── env.example             # Environment variables template
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js 16+** and **npm** (for frontend)
- **Python 3.8+** and **pip** (for backend)
- **API Keys** for your chosen LLM provider and vector database

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd rag-chat-platform
```

### 2. Environment Setup

Copy the environment template and configure your credentials:

```bash
cp env.example .env
```

Edit `.env` with your actual API keys:

```env
# Required
OPENAI_API_KEY=sk-your-actual-openai-key
PINECONE_API_KEY=your-actual-pinecone-key
PINECONE_ENV=us-west1-gcp-free
PINECONE_INDEX=your-index-name

# Optional (for other providers)
ANTHROPIC_API_KEY=your-anthropic-key
QDRANT_URL=your-qdrant-url
QDRANT_API_KEY=your-qdrant-key
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

**API Documentation:** Visit `http://localhost:8000/docs` for interactive API documentation.

### 4. Frontend Setup

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### 5. Verify Setup

1. Visit `http://localhost:3000` in your browser
2. Fill in the settings form with your API credentials
3. Click "Connect" to establish the connection
4. Start chatting with your documents!

## 🧪 How to Test

### Basic Testing

1. **Configure Settings:**
   - Select your LLM provider (OpenAI, Anthropic, etc.)
   - Enter your API key
   - Choose your vector database type
   - Provide database credentials and index name
   - Click "Connect"

2. **Test Chat Functionality:**
   - Ask a question in the chat interface
   - Verify that the system retrieves relevant documents
   - Check that responses include source citations
   - Test error handling with invalid queries

### Advanced Testing

- **Multiple Providers:** Test different LLM providers and vector databases
- **Error Scenarios:** Test with invalid API keys or unreachable databases
- **Performance:** Test with complex queries and large document sets
- **Source Verification:** Verify that returned sources are accurate and relevant

## 📊 Ingesting External Data

The platform includes a powerful data ingestion system that allows you to import structured data from various databases and automatically embed it for RAG-based chat.

### How to Use Data Ingestion

1. **Navigate to Ingestion:** After connecting to your RAG system, click the "📊 Ingest Data" tab
2. **Configure Data Source:** 
   - Select your database type (MongoDB, PostgreSQL, MySQL)
   - Enter connection URI 
   - Specify collection/table name
   - Add optional filters to limit data
3. **Configure Vector Storage:**
   - Choose your vector database (Qdrant, Pinecone)
   - Provide database URL and API credentials
   - Specify collection/index name for storage
4. **Start Ingestion:** Click "Start Data Ingestion" and monitor progress

### Supported Connection Formats

**MongoDB:**
```
mongodb://username:password@host:port/database
```

**PostgreSQL:**
```
postgresql://username:password@host:port/database
```

**MySQL:**
```
mysql+pymysql://username:password@host:port/database
```

### Filter Examples

**MongoDB (JSON format):**
```json
{"status": "active", "category": "important"}
```

**SQL (WHERE clause):**
```sql
status = 'active' AND created_at > '2024-01-01'
```

### What Happens During Ingestion

1. **Data Extraction:** System connects to your database and extracts specified records
2. **Text Conversion:** Documents are converted to searchable text format
3. **Embedding Generation:** OpenAI creates vector embeddings for each document
4. **Vector Storage:** Embeddings are stored in your chosen vector database
5. **Completion:** You receive a summary of processed documents and created vectors

After ingestion, you can immediately chat with your newly imported data using the RAG system!

## 🌟 Features

### ⚙️ Flexible Configuration
- **Multiple LLM Providers:** OpenAI, Anthropic, Azure OpenAI
- **Multiple Vector Databases:** Pinecone, Qdrant, Weaviate
- **Dynamic Settings:** Configure connections through the UI
- **Environment Variables:** Secure credential management

### 💬 Intelligent Chat Interface
- **ChatGPT-style UI:** Familiar and intuitive chat experience
- **Real-time Responses:** Fast, streaming-like response display
- **Source Citations:** Transparent source attribution with relevance scores
- **Error Handling:** Graceful error messages and recovery
- **Message History:** Persistent conversation within sessions

### 📊 Data Ingestion System
- **Multiple Data Sources:** MongoDB, PostgreSQL, MySQL support
- **Flexible Filtering:** Custom queries and filters for data selection
- **Automatic Embedding:** Real-time document embedding and vector storage
- **Batch Processing:** Efficient handling of large datasets with configurable limits
- **Progress Tracking:** Real-time feedback on ingestion progress and results

### 🔍 Advanced RAG Pipeline
- **Semantic Search:** Vector-based document retrieval
- **Context-Aware Responses:** LLM responses grounded in retrieved documents
- **Relevance Scoring:** Ranked search results for better accuracy
- **Fallback Handling:** Graceful degradation when databases are unavailable

## 📌 Deployment Options

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the build command: `npm run build`
3. Set the output directory: `build`
4. Deploy automatically on push to main branch

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in Render dashboard

### Alternative Deployment Options

- **Frontend:** Netlify, GitHub Pages, AWS S3 + CloudFront
- **Backend:** Railway, Heroku, AWS Lambda, Google Cloud Run
- **Full-Stack:** Docker containers on any cloud provider

## 🔧 Configuration Options

### Supported LLM Providers

- **OpenAI:** GPT-3.5, GPT-4, and embedding models
- **Anthropic:** Claude models (coming soon)
- **Azure OpenAI:** Enterprise OpenAI deployment

### Supported Vector Databases

- **Pinecone:** Managed vector database with high performance
- **Qdrant:** Open-source vector search engine
- **Weaviate:** GraphQL-based vector database

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Backend server port | No (default: 8000) |
| `OPENAI_API_KEY` | OpenAI API key | Yes (if using OpenAI) |
| `PINECONE_API_KEY` | Pinecone API key | Yes (if using Pinecone) |
| `PINECONE_ENV` | Pinecone environment | Yes (if using Pinecone) |
| `QDRANT_URL` | Qdrant instance URL | Yes (if using Qdrant) |
| `QDRANT_API_KEY` | Qdrant API key | Yes (if using Qdrant) |

## 🚨 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Ensure backend is running on port 8000
- Check CORS settings in `main.py`
- Verify proxy setting in `package.json`

**API key errors:**
- Verify API keys are correctly formatted
- Check API key permissions and quotas
- Ensure environment variables are loaded

**Vector database connection issues:**
- Verify database URLs and credentials
- Check network connectivity
- Ensure indexes exist and are accessible

**Slow response times:**
- Consider using faster embedding models
- Optimize vector database queries
- Implement response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m "Add feature"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues:** Report bugs and request features via GitHub Issues
- **Documentation:** Check the `/docs` endpoint for API documentation
- **Community:** Join our discussions in GitHub Discussions

---

**Built with ❤️ using React, FastAPI, and modern RAG technologies** 