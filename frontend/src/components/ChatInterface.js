import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ settings }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim() || isLoading) return;

    const userMessage = currentMessage.trim();
    setCurrentMessage('');
    setError('');

    // Add user message to chat
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare request payload
      const payload = {
        query: userMessage,
        llm_provider: settings.llmProvider,
        api_key: settings.llmApiKey,
        model_name: settings.modelName,
        vector_db_type: settings.vectorDbType,
        vector_db_url: settings.vectorDbUrl,
        vector_db_api_key: settings.vectorDbApiKey,
        index_name: settings.indexName
      };

      // Make API call to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from server');
      }

      const data = await response.json();

      // Add assistant message to chat
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      setError(err.message);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `Error: ${err.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-strong border border-gray-100">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Chat Assistant</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-soft">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected to {settings.llmProvider} • {settings.vectorDbType}</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Start a conversation</h3>
            <p className="text-gray-600 max-w-md mx-auto">Ask questions about your documents and I'll help you find answers using advanced AI and RAG technology.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Document Q&A</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Smart Search</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">AI Powered</span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-xl px-4 py-3 shadow-soft ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
              
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center text-xs font-medium text-gray-600 mb-2">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Sources:
                  </div>
                  <div className="space-y-1">
                    {message.sources.map((source, index) => (
                      <div key={index} className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                        • {source.title || `Source ${index + 1}`} (Score: {source.score?.toFixed(3)})
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div
                className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-xl px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-soft">
              <div className="flex items-center space-x-3">
                <div className="animate-pulse-glow">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">AI is thinking</span>
                  <div className="text-xs text-gray-500">Analyzing your documents...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        {error && (
          <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-lg shadow-soft">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask a question about your documents..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-soft transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !currentMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                <span className="loading-dots">Sending</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </div>
            )}
          </button>
        </form>
        
        <div className="text-xs text-gray-500 mt-3 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Powered by {settings.llmProvider} and {settings.vectorDbType}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 