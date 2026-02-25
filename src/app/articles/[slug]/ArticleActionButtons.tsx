'use client';

import { Post } from '@/lib/types';

interface ArticleActionButtonsProps {
  article: Post;
}

// Function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function ArticleActionButtons({ article }: ArticleActionButtonsProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: decodeHtmlEntities(article.title),
        text: `Check out this article: ${decodeHtmlEntities(article.title)}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('articleBookmarks') || '[]');
    const isBookmarked = bookmarks.includes(article.slug);
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((slug: string) => slug !== article.slug);
      localStorage.setItem('articleBookmarks', JSON.stringify(newBookmarks));
      alert('Article removed from bookmarks!');
    } else {
      bookmarks.push(article.slug);
      localStorage.setItem('articleBookmarks', JSON.stringify(bookmarks));
      alert('Article added to bookmarks!');
    }
  };

  return (
    <div className="flex space-x-2 lg:ml-6">
      <button 
        onClick={handleShare}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Share article"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      <button 
        onClick={handlePrint}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Print article"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
      <button 
        onClick={handleBookmark}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Bookmark article"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>
  );
} 