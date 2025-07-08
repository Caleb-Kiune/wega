"use client"

import { useEffect, useState } from 'react';

interface SearchAnalytics {
  totalSearches: number;
  popularSearches: string[];
  averageResults: number;
  searchSuccessRate: number;
}

export function useSearchAnalytics() {
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    popularSearches: [],
    averageResults: 0,
    searchSuccessRate: 0,
  });

  const trackSearch = (query: string, resultsCount: number) => {
    // Store search data in localStorage for analytics
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newSearch = {
      query,
      resultsCount,
      timestamp: Date.now(),
    };
    
    searchHistory.push(newSearch);
    
    // Keep only last 100 searches
    if (searchHistory.length > 100) {
      searchHistory.splice(0, searchHistory.length - 100);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // Update analytics
    updateAnalytics(searchHistory);
  };

  const updateAnalytics = (searchHistory: any[]) => {
    if (searchHistory.length === 0) return;

    const totalSearches = searchHistory.length;
    const averageResults = searchHistory.reduce((sum, search) => sum + search.resultsCount, 0) / totalSearches;
    const successfulSearches = searchHistory.filter(search => search.resultsCount > 0).length;
    const searchSuccessRate = (successfulSearches / totalSearches) * 100;

    // Get popular searches (top 5)
    const searchCounts: { [key: string]: number } = {};
    searchHistory.forEach(search => {
      const query = search.query.toLowerCase().trim();
      if (query) {
        searchCounts[query] = (searchCounts[query] || 0) + 1;
      }
    });

    const popularSearches = Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);

    setAnalytics({
      totalSearches,
      popularSearches,
      averageResults: Math.round(averageResults),
      searchSuccessRate: Math.round(searchSuccessRate),
    });
  };

  useEffect(() => {
    // Load existing analytics on mount
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    updateAnalytics(searchHistory);
  }, []);

  return { analytics, trackSearch };
}

export function SearchAnalyticsDisplay() {
  const { analytics } = useSearchAnalytics();

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Search Analytics</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Total Searches</p>
          <p className="text-2xl font-bold text-green-600">{analytics.totalSearches}</p>
        </div>
        <div>
          <p className="text-gray-600">Success Rate</p>
          <p className="text-2xl font-bold text-green-600">{analytics.searchSuccessRate}%</p>
        </div>
        <div>
          <p className="text-gray-600">Avg Results</p>
          <p className="text-2xl font-bold text-green-600">{analytics.averageResults}</p>
        </div>
        <div>
          <p className="text-gray-600">Popular Searches</p>
          <div className="text-xs text-gray-500">
            {analytics.popularSearches.slice(0, 3).map((query, index) => (
              <div key={index} className="truncate">{query}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 