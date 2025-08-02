import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { cleanText } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  featured?: boolean;
}

export default function RecipeCard({ recipe, featured = false }: RecipeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${featured ? 'ring-2 ring-primary-400' : ''}`}>
      {recipe.featuredImageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={recipe.featuredImageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <span>{formatDate(recipe.date)}</span>
          {recipe.cookTime && (
            <>
              <span className="mx-2">•</span>
              <span>{recipe.cookTime}</span>
            </>
          )}
          {recipe.servings && (
            <>
              <span className="mx-2">•</span>
              <span>{recipe.servings} servings</span>
            </>
          )}
        </div>
        
        <h3 className={`font-bold mb-2 ${featured ? 'text-xl' : 'text-lg'}`}>
          <Link href={`/recipes/${recipe.slug}`} className="text-neutral-900 hover:text-accent-sky transition-colors">
            {recipe.title}
          </Link>
        </h3>
        
        {recipe.excerpt && (
          <p className="text-neutral-700 mb-4 line-clamp-3">
            {cleanText(recipe.excerpt)}
          </p>
        )}
        
        {recipe.difficulty && (
          <div className="flex items-center text-sm text-neutral-600">
            <span className="font-medium">Difficulty:</span>
            <span className="ml-1">{recipe.difficulty}</span>
          </div>
        )}
      </div>
    </article>
  );
} 