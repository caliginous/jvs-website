import React from 'react';

export default function QuickNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Navigation</h2>
          <div className="hidden md:flex space-x-6">
            {[
              { id: 'why-vegan', label: 'Why Vegan?' },
              { id: 'festivals', label: 'Festivals' },
              { id: 'faqs', label: 'FAQs' },
              { id: 'caterers', label: 'Caterers' },
              { id: 'magazine', label: 'Magazine' }
            ].map((item) => (
              <a
                key={item.id}
                href={`/resources#${item.id}`}
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button className="md:hidden text-gray-600 hover:text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
} 