'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Magazine {
  id: string;
  title: string;
  date: string;
  pdf_url: string;
  cover_image?: string;
  summary?: string;
  ocr_text?: string;
}

export default function MagazineDetailPage({ params }: { params: { id: string } }) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        const response = await fetch(`/api/magazine?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch magazine');
        }
        const data = await response.json();
        setMagazine(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load magazine');
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Magazine Not Found</h1>
            <p className="text-gray-600 mb-8">
              {error || 'The requested magazine could not be found.'}
            </p>
            <Link 
              href="/magazine"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Magazine Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Archive */}
        <div className="mb-8">
          <Link 
            href="/magazine"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Magazine Archive
          </Link>
        </div>

        {/* Magazine Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{magazine.title}</h1>
          
          <p className="text-gray-600 mb-6">
            {new Date(magazine.date).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          {magazine.summary && (
            <p className="text-gray-700 text-lg mb-6">{magazine.summary}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={magazine.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              Download PDF
            </a>
            
            <a 
              href={magazine.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
            >
              View PDF Online
            </a>
          </div>
        </div>

        {/* Magazine Content */}
        {magazine.ocr_text && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Magazine Content</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {magazine.ocr_text}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/magazine"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse All Magazines
          </Link>
        </div>
      </div>
    </div>
  );
} 