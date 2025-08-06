'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

interface Magazine {
  id: string;
  title: string;
  date: string;
  r2_key: string;
  cover_image?: string;
  ocr_text?: string;
  summary?: string;
  pdf_url: string;
}

export default function MagazineDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    fetchMagazine();
  }, [id]);

  const fetchMagazine = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/magazine?id=${encodeURIComponent(id)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch magazine');
      }
      
      const data = await response.json();
      setMagazine(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading magazine...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !magazine) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
            <p className="text-gray-600">{error || 'Magazine not found'}</p>
            <Link 
              href="/magazine"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Back to Magazine Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/magazine"
                className="text-green-600 hover:text-green-700 mb-4 inline-block"
              >
                ← Back to Magazine Archive
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {magazine.title}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {formatDate(magazine.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Magazine Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Title</h3>
                  <p className="text-gray-600">{magazine.title}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Publication Date</h3>
                  <p className="text-gray-600">{formatDate(magazine.date)}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Issue ID</h3>
                  <p className="text-gray-600 font-mono text-sm">{magazine.id}</p>
                </div>
                
                {magazine.cover_image && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Cover Image</h3>
                    <img 
                      src={magazine.cover_image} 
                      alt={`Cover of ${magazine.title}`}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  This magazine issue is part of the Jewish Vegetarian Society&apos;s historical archive.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* PDF Download */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Download PDF
              </h2>
              
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  Download this magazine issue as a PDF file
                </p>
                <a
                  href={magazine.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>

            {/* OCR Text Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                OCR Text Content
              </h2>

              {magazine.ocr_text ? (
                <div>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className={`text-gray-700 leading-relaxed ${
                        !showFullText ? 'max-h-96 overflow-hidden' : ''
                      }`}
                    >
                      {showFullText ? magazine.ocr_text : truncateText(magazine.ocr_text)}
                    </div>
                  </div>
                  
                  {magazine.ocr_text.length > 500 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => setShowFullText(!showFullText)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        {showFullText ? 'Show Less' : 'Show Full Text'}
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 About This Content</h3>
                    <p className="text-blue-800 text-sm">
                      This text was extracted from the scanned magazine using Optical Character Recognition (OCR) technology. 
                      While we strive for accuracy, some text may contain minor errors due to the scanning process.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No OCR Text Available
                  </h3>
                  <p className="text-gray-600">
                    This magazine issue doesn&apos;t have OCR text content yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 