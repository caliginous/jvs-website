import { gql } from '@apollo/client';
import { wpClient } from './wpClient';

// GraphQL query for recipes
export const RECIPES_QUERY = gql`
  query Recipes($first: Int, $after: String, $search: String, $category: String) {
    mrdtRecipes(first: $first, after: $after, where: { 
      search: $search,
      taxQuery: {
        taxArray: [
          {
            taxonomy: MRDT_RECIPES_CATS,
            terms: [$category],
            field: SLUG
          }
        ]
      }
    }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        recipeMeta {
          servings
          preparationTime
          preparationTimeMicroformat
          ingredients {
            heading
            text
          }
          instructions {
            text
            image {
              sourceUrl
              altText
            }
          }
          nutrition {
            title
            amount
          }
        }
        recipeCategories {
          nodes {
            id
            name
            slug
          }
        }
        recipeTags {
          nodes {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// GraphQL query for recipe categories
export const RECIPE_CATEGORIES_QUERY = gql`
  query RecipeCategories {
    mrdtRecipesCats {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

// Recipe interface based on the Meridian theme structure
export interface Recipe {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  recipeMeta?: {
    servings?: string;
    preparationTime?: string;
    preparationTimeMicroformat?: string;
    ingredients?: Array<{
      heading?: string;
      text?: string;
    }>;
    instructions?: Array<{
      text?: string;
      image?: {
        sourceUrl: string;
        altText: string;
      };
    }>;
    nutrition?: Array<{
      title?: string;
      amount?: string;
    }>;
  };
  recipeCategories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  recipeTags?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export interface RecipeCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Fetch recipes with optional search and filtering
export async function getRecipes(
  search?: string,
  category?: string,
  first: number = 12,
  after?: string
): Promise<{ recipes: Recipe[]; hasNextPage: boolean; endCursor?: string }> {
  try {
    const { data } = await wpClient.query({
      query: RECIPES_QUERY,
      variables: {
        first,
        after,
        search: search || null,
        category: category || null,
      },
    });

    return {
      recipes: data.mrdtRecipes.nodes || [],
      hasNextPage: data.mrdtRecipes.pageInfo.hasNextPage,
      endCursor: data.mrdtRecipes.pageInfo.endCursor,
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      recipes: [],
      hasNextPage: false,
    };
  }
}

// Fetch recipe categories
export async function getRecipeCategories(): Promise<RecipeCategory[]> {
  try {
    const { data } = await wpClient.query({
      query: RECIPE_CATEGORIES_QUERY,
    });

    return data.mrdtRecipesCats.nodes || [];
  } catch (error) {
    console.error('Error fetching recipe categories:', error);
    return [];
  }
}

// Fetch a single recipe by slug
export async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const { data } = await wpClient.query({
      query: gql`
        query Recipe($slug: ID!) {
          mrdtRecipe(id: $slug, idType: SLUG) {
            id
            title
            slug
            excerpt
            date
            content
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            recipeMeta {
              servings
              preparationTime
              preparationTimeMicroformat
              ingredients {
                heading
                text
              }
              instructions {
                text
                image {
                  sourceUrl
                  altText
                }
              }
              nutrition {
                title
                amount
              }
            }
            recipeCategories {
              nodes {
                id
                name
                slug
              }
            }
            recipeTags {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      `,
      variables: { slug },
    });

    return data.mrdtRecipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
} 