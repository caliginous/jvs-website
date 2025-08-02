import { Recipe } from '@/lib/types';
import RecipeClient from './RecipeClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// This function will run at build time
async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch('https://jvs.org.uk/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetRecipes($first: Int) {
            recipes(first: $first) {
              id
              title
              slug
              date
              excerpt
              content
              featuredImageUrl
              ingredients
              instructions
              servings
              preparationTime
              cookTime
              difficulty
              categories
              tags
              views
              jvsTestField
            }
          }
        `,
        variables: { first: 300 }
      }),
    });

    const data = await response.json();
    
    if (data.errors) {
      console.log('GraphQL errors:', data.errors);
      return [];
    }
    
    const recipes = data.data?.recipes || [];
    console.log('Fetched recipes:', recipes.length);
    
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <RecipeClient initialRecipes={recipes} />
      <Footer />
    </div>
  );
} 