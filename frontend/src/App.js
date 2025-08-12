import React, { useState } from 'react';
import SettingsForm from './components/SettingsForm';
import ChatInterface from './components/ChatInterface';
import IngestData from './components/IngestData';

function App() {
  const [settings, setSettings] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'ingest'

  const handleConnect = (connectionSettings) => {
    setSettings(connectionSettings);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setSettings(null);
    setIsConnected(false);
    setCurrentView('chat');
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="hero-title font-bold text-gray-900 mb-6 animate-fade-in-up">
              <span className="gradient-text">
                RAG Chat Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Transform your documents into intelligent conversations. Connect your data sources and chat with your knowledge base using advanced AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary focus-ring"
              >
                Learn More
              </button>
              <button
                onClick={() => document.getElementById('get-started').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 focus-ring"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that make document-based conversations seamless and intelligent
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Intelligence</h3>
              <p className="text-gray-600">Upload and process any type of document with advanced AI-powered understanding</p>
            </div>
            
            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Conversations</h3>
              <p className="text-gray-600">Engage in natural conversations with your documents using state-of-the-art language models</p>
            </div>
            
            <div className="feature-card text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Get instant responses with optimized vector search and efficient data processing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div id="get-started" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect your LLM provider and vector database to start chatting with your documents in minutes
          </p>
          <div className="bg-white rounded-2xl shadow-strong p-8 animate-fade-in-up">
            <SettingsForm onConnect={handleConnect} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">RAG Chat Platform</h3>
            <p className="text-gray-400 mb-6">
              Transforming documents into intelligent conversations
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Main App Interface
  const MainApp = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">RAG Chat Platform</h1>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="flex space-x-1">
                <button
                  onClick={() => setCurrentView('chat')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'chat'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setCurrentView('ingest')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === 'ingest'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  📊 Ingest Data
                </button>
              </nav>
            </div>
            
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'chat' && <ChatInterface settings={settings} />}
        {currentView === 'ingest' && <IngestData />}
      </main>
    </div>
  );

  return (
    <div className="App">
      {!isConnected ? <LandingPage /> : <MainApp />}
    </div>
  );
}

export default App; 