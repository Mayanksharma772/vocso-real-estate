'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    const formattedCity = city.trim().replace(/\s+/g, '-');
    router.push(`/city/${encodeURIComponent(formattedCity)}`);
  };

  const handleQuickSearch = (cityName: string) => {
    setCity(cityName);
    setIsLoading(true);
    router.push(`/city/${encodeURIComponent(cityName)}`);
  };

  const popularCities = [
    'Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai',
    'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Real Estate Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover new real estate projects across Indian cities with real-time data
            from MagicBricks and interactive maps
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                Enter City Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Hyderabad, Mumbai, Bangalore..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!city.trim() || isLoading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              {isLoading ? 'Searching...' : 'Explore Projects'}
            </button>
          </form>
        </div>

        {/* Popular Cities */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularCities.map((cityName) => (
              <button
                key={cityName}
                onClick={() => handleQuickSearch(cityName)}
                disabled={isLoading}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-gray-700">{cityName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Data</h3>
            <p className="text-gray-600">Get the latest project information scraped directly from MagicBricks</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Maps</h3>
            <p className="text-gray-600">Visualize project locations on interactive maps with detailed popups</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Updates</h3>
            <p className="text-gray-600">Watch projects load incrementally with live progress tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
