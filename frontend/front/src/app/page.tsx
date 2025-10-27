'use client';
import { useState } from 'react';
import { Cloud, Sparkles, MapPin, Loader2 } from 'lucide-react';

type AdviceResponse = {
  city?: string;
  result?: string;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [data, setData] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  async function fetchAdvice() {
    if (!city.trim()) return alert('Enter a city name');
    setLoading(true);
    setShowResult(false);
    
    try {
      const res = await fetch('https://fastapi-backend-777268942678.europe-west1.run.app/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const json: AdviceResponse = await res.json();
      setData(json);
      setTimeout(() => setShowResult(true), 100);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong 😅');
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchAdvice();
  };

  return (
    <>
      <style jsx>{`
        .advice-content {
          word-wrap: break-word;
        }
        
        .advice-content strong,
        .advice-content b {
          color: #7c3aed;
          font-weight: 700;
        }
        
        .advice-content em,
        .advice-content i {
          color: #db2777;
          font-style: italic;
        }
        
        .advice-content mark,
        .advice-content .highlight {
          background: linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%);
          color: #1f2937;
          padding: 0.125rem 0.375rem;
          border-radius: 0.375rem;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
        }
        
        .advice-content ul,
        .advice-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .advice-content li {
          margin: 0.5rem 0;
          line-height: 1.75;
        }
        
        .advice-content p {
          margin: 0.75rem 0;
        }
        
        .advice-content a {
          color: #7c3aed;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        
        .advice-content a:hover {
          color: #db2777;
        }
        
        .advice-content code {
          background: #f3f4f6;
          color: #7c3aed;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
      `}</style>
      
      <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
          {/* Header Section */}
          <div className="text-center mb-12 transform transition-all duration-700 hover:scale-105">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/30">
              <Cloud className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-6xl font-bold mb-4 text-white drop-shadow-lg">
              CloudWear AI
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              <p className="text-xl text-white/90 font-medium">
                Weather-Aware Travel Intelligence
              </p>
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            
            <p className="text-white/80 max-w-md mx-auto leading-relaxed">
              Get witty, personalized clothing & travel advice powered by AWS Lambda + Gemini AI
            </p>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-xl mb-8">
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02]">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter a city (e.g., Badrinath)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-300 text-gray-800 placeholder-gray-400 font-medium"
                  />
                </div>
                
                <button
                  onClick={fetchAdvice}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get Advice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          {data && (
            <div 
              className={`w-full max-w-2xl transform transition-all duration-700 ${
                showResult ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                {/* City Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                  <div className="flex items-center justify-center gap-3">
                    <MapPin className="w-6 h-6 text-white" />
                    <h2 className="text-3xl font-bold text-white">
                      {data.city || city}
                    </h2>
                  </div>
                </div>
                
                {/* Advice Content */}
                <div className="px-8 py-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-gray-700 text-lg leading-relaxed advice-content"
                        dangerouslySetInnerHTML={{ 
                          __html: data.result || 'No advice available 😅' 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Footer Decoration */}
                <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              Powered by AWS Lambda & Gemini AI ✨
            </p>
          </div>
        </div>
      </main>
    </>
  );
}