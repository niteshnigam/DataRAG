import React, { useState } from 'react';

const SettingsForm = ({ onConnect }) => {
  const [formData, setFormData] = useState({
    llmProvider: 'openai',
    llmApiKey: '',
    modelName: 'gpt-3.5-turbo',
    vectorDbType: 'pinecone',
    vectorDbUrl: '',
    vectorDbApiKey: '',
    indexName: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.llmApiKey.trim()) {
      setError('LLM API Key is required');
      setIsLoading(false);
      return;
    }

    if (!formData.vectorDbApiKey.trim()) {
      setError('Vector DB API Key is required');
      setIsLoading(false);
      return;
    }

    if (!formData.indexName.trim()) {
      setError('Index Name is required');
      setIsLoading(false);
      return;
    }

    try {
      // Test connection (you could add an actual test endpoint here)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onConnect(formData);
    } catch (err) {
      setError('Failed to connect. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* LLM Provider Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-soft">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">LLM Provider</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="llmProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              id="llmProvider"
              name="llmProvider"
              value={formData.llmProvider}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="azure">Azure OpenAI</option>
            </select>
          </div>

          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
              Model Name
            </label>
            <input
              type="text"
              id="modelName"
              name="modelName"
              value={formData.modelName}
              onChange={handleInputChange}
              placeholder="e.g., gpt-3.5-turbo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="llmApiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key *
          </label>
          <input
            type="password"
            id="llmApiKey"
            name="llmApiKey"
            value={formData.llmApiKey}
            onChange={handleInputChange}
            placeholder="Enter your LLM API key"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Vector Database Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-soft">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Vector Database</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vectorDbType" className="block text-sm font-medium text-gray-700 mb-1">
              Database Type
            </label>
            <select
              id="vectorDbType"
              name="vectorDbType"
              value={formData.vectorDbType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="pinecone">Pinecone</option>
              <option value="qdrant">Qdrant</option>
              <option value="weaviate">Weaviate</option>
            </select>
          </div>

          <div>
            <label htmlFor="indexName" className="block text-sm font-medium text-gray-700 mb-1">
              Index Name *
            </label>
            <input
              type="text"
              id="indexName"
              name="indexName"
              value={formData.indexName}
              onChange={handleInputChange}
              placeholder="Enter index name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="vectorDbUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Database URL
          </label>
          <input
            type="url"
            id="vectorDbUrl"
            name="vectorDbUrl"
            value={formData.vectorDbUrl}
            onChange={handleInputChange}
            placeholder="https://your-db-url.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="vectorDbApiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key *
          </label>
          <input
            type="password"
            id="vectorDbApiKey"
            name="vectorDbApiKey"
            value={formData.vectorDbApiKey}
            onChange={handleInputChange}
            placeholder="Enter your vector DB API key"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-soft">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            <span className="loading-dots">Connecting</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect & Start Chatting
          </div>
        )}
      </button>
    </form>
  );
};

export default SettingsForm; 