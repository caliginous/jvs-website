import { gql } from '@apollo/client';

// Query for homepage data
export const HOMEPAGE_QUERY = gql`
  query Homepage {
    posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Query for hero content
export const HERO_QUERY = gql`
  query HeroContent {
    post(id: "hero", idType: SLUG) {
      id
      title
      content
      excerpt
    }
  }
`;

// Query for about page content
export const ABOUT_QUERY = gql`
  query AboutContent {
    page(id: "/about-jvs/", idType: URI) {
      id
      title
      content
    }
  }
`;

// Query for articles listing
export const ARTICLES_QUERY = gql`
  query Articles($first: Int, $after: String) {
    posts(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
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

// Query for single article
export const ARTICLE_QUERY = gql`
  query Article($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

// Query for events (custom event products)
export const EVENTS_QUERY = gql`
  query Events {
    eventProducts {
      id
      name
      price
      eventDate
      eventEndDate
      eventVenue
      eventPrice
      stockQuantity
      stockStatus
      purchasable
      shortDescription
      featuredImageUrl
      jvsTestField
      ticketTypes {
        label
        type
        price
        available
      }
    }
  }
`;

// Note: There is no individual eventProduct query in the GraphQL schema
// We use EVENTS_QUERY and filter by ID instead

// Standard WooCommerce GraphQL mutations
export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          node {
            id
            name
            price(format: RAW)
          }
        }
        quantity
        total
      }
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    cart {
      contents(first: 100) {
        nodes {
          key
          product {
            node {
              id
              name
              price(format: RAW)
            }
          }
          quantity
          total
        }
      }
      total
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($input: RemoveItemsFromCartInput!) {
    removeItemsFromCart(input: $input) {
      cartItems {
        key
        product {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

// For order creation, we'll use WooCommerce's standard checkout process
// This is more reliable than custom mutations

// Query to check available mutations (for debugging)
export const INTROSPECTION_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      mutationType {
        fields {
          name
          description
        }
      }
    }
  }
`;

// Query for search
export const SEARCH_QUERY = gql`
  query Search($search: String!, $first: Int) {
    posts(first: $first, where: { search: $search }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        author {
          node {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

// Note: We now use WooCommerce's native checkout flow instead of GraphQL mutations
// This is more reliable and follows the WooNuxt pattern 

export const GET_RECIPES = gql`
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
`;

export const GET_RECIPE_BY_SLUG = gql`
  query GetRecipeBySlug($slug: String!) {
    recipes(first: 100) {
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
`; 

export const HOMEPAGE_SETTINGS_QUERY = gql`
  query HomepageSettings {
    homepageSettings {
      heroTitle
      heroSubtitle
      heroCtaPrimary
      heroCtaSecondary
      eventsSectionTitle
      articlesSectionTitle
      recipesSectionTitle
      eventsCtaText
      articlesCtaText
      recipesCtaText
      aboutSectionTitle
      aboutSectionContent
      aboutCtaText
    }
  }
`;