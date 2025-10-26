'use client';

import { useState } from 'react';

type AdviceResponse = {
  city?: string;
  result?: string;
};

export default function Home() {
  const [city, setCity] = useState('');
  const [data, setData] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAdvice() {
    if (!city.trim()) return alert('Enter a city name');
    setLoading(true);
    try {
      const res = await fetch('https://cloudwear-1.onrender.com/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const json: AdviceResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong 😅');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">☁️ CloudWear AI</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Get witty, weather-aware travel & clothing advice powered by AWS Lambda + Gemini
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter a city (e.g., Badrinath)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-400 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Loading...' : 'Get Advice'}
        </button>
      </div>

      {data && (
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">{data.city || city}</h2>
          <p className="text-gray-700 italic">
            {data.result || 'No advice available 😅'}
          </p>
        </div>
      )}
    </main>
  );
}