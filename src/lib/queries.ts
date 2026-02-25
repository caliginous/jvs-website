import { gql } from '@apollo/client';

// Deprecated WP content queries removed

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

// Deprecated WP search query removed

// Note: We now use WooCommerce's native checkout flow instead of GraphQL mutations
// This is more reliable and follows the WooNuxt pattern 

// Deprecated WP recipe queries removed

// Deprecated WP ACF homepage settings query removed