import Link from 'next/link';
import { Post } from '@/lib/types';
import { cleanText } from '@/lib/utils';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${featured ? 'ring-2 ring-primary-400' : ''}`}>
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <span>{formatDate(post.date)}</span>
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <span>{post.author.node.name}</span>
            </>
          )}
        </div>
        
        <h3 className={`font-bold mb-2 ${featured ? 'text-xl' : 'text-lg'}`}>
          <Link href={`/articles/${post.slug}`} className="text-neutral-900 hover:text-accent-sky transition-colors">
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-neutral-700 mb-4 line-clamp-3">
            {cleanText(post.excerpt)}
          </p>
        )}
        

      </div>
    </article>
  );
} 