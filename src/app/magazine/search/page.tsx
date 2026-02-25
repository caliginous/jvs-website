'use client';

import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface SearchResult {
  id: string;
  title: string;
  date: string;
  r2_key: string;
  snippet: string;
  pdf_url: string;
}

export default function MagazineSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(`/api/search-magazines?q=${encodeURIComponent(query.trim())}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const highlightSnippet = (snippet: string) => {
    return snippet.replace(
      /<mark>(.*?)<\/mark>/g,
      '<span class="bg-yellow-200 font-semibold">$1</span>'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Search Magazine Archive
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search through decades of Jewish vegan content
            </p>
            <Link 
              href="/magazine"
              className="inline-block px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              ← Back to Archive
            </Link>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles, recipes, authors, or topics..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Search Tips</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Search for specific topics like &quot;kosher recipes&quot; or &quot;vegan ethics&quot;</li>
            <li>• Look for authors by name</li>
            <li>• Search for specific years or time periods</li>
            <li>• Use quotes for exact phrases</li>
          </ul>
        </div>

        {/* Results */}
        {searched && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching magazine archive...</p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Search Results for &quot;{query}&quot;
                  </h2>
                  <p className="text-gray-600">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      Try different keywords or browse the full archive.
                    </p>
                    <Link
                      href="/magazine"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Browse All Issues
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {results.map((result) => (
                      <div 
                        key={result.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            <Link 
                              href={`/magazine/${result.id}`}
                              className="hover:text-green-600 transition-colors"
                            >
                              {result.title}
                            </Link>
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(result.date)}
                          </span>
                        </div>
                        
                        <div 
                          className="text-gray-700 mb-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: highlightSnippet(result.snippet) 
                          }}
                        />
                        
                        <div className="flex space-x-3">
                          <Link
                            href={`/magazine/${result.id}`}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            View Issue
                          </Link>
                          <a
                            href={result.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
                          >
                            Download PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              Search powered by full-text OCR indexing of scanned magazine content.
            </p>
            <p className="mt-2 text-sm">
              Results highlight matching terms in context from the original magazine text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 