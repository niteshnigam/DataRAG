import React, { useState } from 'react';

const IngestData = () => {
  const [formData, setFormData] = useState({
    dataSourceType: 'mongodb',
    connectionUri: '',
    collectionTableName: '',
    filterQuery: '',
    limit: 10,
    vectorDbType: 'qdrant',
    vectorDbUrl: '',
    vectorDbApiKey: '',
    collectionName: '',
    openaiApiKey: '',
    embeddingModel: 'text-embedding-ada-002'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    // Basic validation
    if (!formData.connectionUri.trim()) {
      setError('Connection URI is required');
      setIsLoading(false);
      return;
    }

    if (!formData.collectionTableName.trim()) {
      setError('Collection/Table name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.vectorDbUrl.trim()) {
      setError('Vector DB URL is required');
      setIsLoading(false);
      return;
    }

    if (!formData.vectorDbApiKey.trim()) {
      setError('Vector DB API Key is required');
      setIsLoading(false);
      return;
    }

    if (!formData.openaiApiKey.trim()) {
      setError('OpenAI API Key is required');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        data_source_type: formData.dataSourceType,
        connection_uri: formData.connectionUri,
        collection_table_name: formData.collectionTableName,
        filter_query: formData.filterQuery || null,
        limit: parseInt(formData.limit),
        vector_db_type: formData.vectorDbType,
        vector_db_url: formData.vectorDbUrl,
        vector_db_api_key: formData.vectorDbApiKey,
        collection_name: formData.collectionName,
        openai_api_key: formData.openaiApiKey,
        embedding_model: formData.embeddingModel
      };

      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to ingest data');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderText = (field) => {
    if (field === 'connectionUri') {
      switch (formData.dataSourceType) {
        case 'mongodb':
          return 'mongodb://username:password@host:port/database';
        case 'postgresql':
          return 'postgresql://username:password@host:port/database';
        case 'mysql':
          return 'mysql+pymysql://username:password@host:port/database';
        default:
          return '';
      }
    }
    
    if (field === 'filterQuery') {
      switch (formData.dataSourceType) {
        case 'mongodb':
          return '{"status": "active"} (JSON format)';
        case 'postgresql':
        case 'mysql':
          return 'status = \'active\' (SQL WHERE clause)';
        default:
          return '';
      }
    }
    
    return '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-strong border border-gray-100">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Ingest External Data</h2>
          </div>
          <p className="text-lg text-gray-600">
            Connect to your database, extract data, and embed it into your vector database for enhanced RAG capabilities.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Source Section */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-soft">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Data Source Configuration</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dataSourceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Database Type *
                  </label>
                  <select
                    id="dataSourceType"
                    name="dataSourceType"
                    value={formData.dataSourceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mongodb">MongoDB</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="collectionTableName" className="block text-sm font-medium text-gray-700 mb-2">
                    Collection/Table Name *
                  </label>
                  <input
                    type="text"
                    id="collectionTableName"
                    name="collectionTableName"
                    value={formData.collectionTableName}
                    onChange={handleInputChange}
                    placeholder={formData.dataSourceType === 'mongodb' ? 'collection_name' : 'table_name'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="connectionUri" className="block text-sm font-medium text-gray-700 mb-2">
                  Connection URI *
                </label>
                <input
                  type="text"
                  id="connectionUri"
                  name="connectionUri"
                  value={formData.connectionUri}
                  onChange={handleInputChange}
                  placeholder={getPlaceholderText('connectionUri')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label htmlFor="filterQuery" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Query (Optional)
                  </label>
                  <input
                    type="text"
                    id="filterQuery"
                    name="filterQuery"
                    value={formData.filterQuery}
                    onChange={handleInputChange}
                    placeholder={getPlaceholderText('filterQuery')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-2">
                    Limit (Number of Records)
                  </label>
                  <select
                    id="limit"
                    name="limit"
                    value={formData.limit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={25}>Top 25</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vector Database Section */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                🔍 Vector Database Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vectorDbType" className="block text-sm font-medium text-gray-700 mb-2">
                    Vector Database Type
                  </label>
                  <select
                    id="vectorDbType"
                    name="vectorDbType"
                    value={formData.vectorDbType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="qdrant">Qdrant</option>
                    <option value="pinecone">Pinecone</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700 mb-2">
                    Collection/Index Name *
                  </label>
                  <input
                    type="text"
                    id="collectionName"
                    name="collectionName"
                    value={formData.collectionName}
                    onChange={handleInputChange}
                    placeholder="my-documents"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="vectorDbUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Vector DB URL *
                </label>
                <input
                  type="url"
                  id="vectorDbUrl"
                  name="vectorDbUrl"
                  value={formData.vectorDbUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-cluster.qdrant.tech:6333"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="vectorDbApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Vector DB API Key *
                </label>
                <input
                  type="password"
                  id="vectorDbApiKey"
                  name="vectorDbApiKey"
                  value={formData.vectorDbApiKey}
                  onChange={handleInputChange}
                  placeholder="Enter your vector DB API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Embedding Configuration Section */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                🧠 Embedding Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="embeddingModel" className="block text-sm font-medium text-gray-700 mb-2">
                    Embedding Model
                  </label>
                  <select
                    id="embeddingModel"
                    name="embeddingModel"
                    value={formData.embeddingModel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                    <option value="text-embedding-3-small">text-embedding-3-small</option>
                    <option value="text-embedding-3-large">text-embedding-3-large</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="openaiApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key *
                  </label>
                  <input
                    type="password"
                    id="openaiApiKey"
                    name="openaiApiKey"
                    value={formData.openaiApiKey}
                    onChange={handleInputChange}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 rounded-full p-1 mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-green-900">Ingestion Successful!</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Documents Processed</div>
                    <div className="text-2xl font-bold text-green-600">{result.documents_processed}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Vectors Created</div>
                    <div className="text-2xl font-bold text-green-600">{result.vectors_created}</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-700">Status</div>
                    <div className="text-lg font-semibold text-green-600">Complete</div>
                  </div>
                </div>
                <p className="text-green-700 mt-4">{result.message}</p>
              </div>
            )}

            {/* Error Section */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-red-500 rounded-full p-1 mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Processing... This may take a few minutes
                  </div>
                ) : (
                  'Start Data Ingestion'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IngestData; 