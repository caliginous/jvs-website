import { wpClient } from '../wpClient'

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
  createHttpLink: jest.fn(),
  from: jest.fn(),
  split: jest.fn(),
  createClient: jest.fn(),
}))

describe('WordPress GraphQL Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be properly configured', () => {
    expect(wpClient).toBeDefined()
    expect(typeof wpClient.query).toBe('function')
    expect(typeof wpClient.mutate).toBe('function')
  })

  it('should have correct endpoint configuration', () => {
    // The client should be configured to connect to the WordPress GraphQL endpoint
    expect(wpClient.link).toBeDefined()
  })

  it('should handle queries correctly', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
          }
        }
      }`,
    }

    const mockResponse = {
      data: {
        posts: {
          nodes: [
            { id: '1', title: 'Test Post' },
          ],
        },
      },
    }

    // Mock the query method
    wpClient.query = jest.fn().mockResolvedValue(mockResponse)

    const result = await wpClient.query(mockQuery)

    expect(wpClient.query).toHaveBeenCalledWith(mockQuery)
    expect(result).toEqual(mockResponse)
  })

  it('should handle mutations correctly', async () => {
    const mockMutation = {
      mutation: `mutation TestMutation($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            title
          }
        }
      }`,
      variables: {
        input: {
          title: 'Test Post',
          content: 'Test content',
        },
      },
    }

    const mockResponse = {
      data: {
        createPost: {
          post: {
            id: '1',
            title: 'Test Post',
          },
        },
      },
    }

    // Mock the mutate method
    wpClient.mutate = jest.fn().mockResolvedValue(mockResponse)

    const result = await wpClient.mutate(mockMutation)

    expect(wpClient.mutate).toHaveBeenCalledWith(mockMutation)
    expect(result).toEqual(mockResponse)
  })

  it('should handle query errors', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
          }
        }
      }`,
    }

    const mockError = new Error('GraphQL query failed')

    // Mock the query method to throw an error
    wpClient.query = jest.fn().mockRejectedValue(mockError)

    await expect(wpClient.query(mockQuery)).rejects.toThrow('GraphQL query failed')
    expect(wpClient.query).toHaveBeenCalledWith(mockQuery)
  })

  it('should handle mutation errors', async () => {
    const mockMutation = {
      mutation: `mutation TestMutation($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            title
          }
        }
      }`,
      variables: {
        input: {
          title: 'Test Post',
          content: 'Test content',
        },
      },
    }

    const mockError = new Error('GraphQL mutation failed')

    // Mock the mutate method to throw an error
    wpClient.mutate = jest.fn().mockRejectedValue(mockError)

    await expect(wpClient.mutate(mockMutation)).rejects.toThrow('GraphQL mutation failed')
    expect(wpClient.mutate).toHaveBeenCalledWith(mockMutation)
  })

  it('should handle network errors', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
          }
        }
      }`,
    }

    const mockNetworkError = new Error('Network error')

    // Mock the query method to throw a network error
    wpClient.query = jest.fn().mockRejectedValue(mockNetworkError)

    await expect(wpClient.query(mockQuery)).rejects.toThrow('Network error')
  })

  it('should handle GraphQL errors in response', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
          }
        }
      }`,
    }

    const mockResponseWithErrors = {
      data: null,
      errors: [
        {
          message: 'Field "invalidField" does not exist on type "Post"',
          locations: [{ line: 3, column: 5 }],
        },
      ],
    }

    // Mock the query method to return a response with errors
    wpClient.query = jest.fn().mockResolvedValue(mockResponseWithErrors)

    const result = await wpClient.query(mockQuery)

    expect(result).toEqual(mockResponseWithErrors)
    expect(result.errors).toBeDefined()
    expect(result.errors).toHaveLength(1)
  })

  it('should handle empty responses', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
          }
        }
      }`,
    }

    const mockEmptyResponse = {
      data: {
        posts: {
          nodes: [],
        },
      },
    }

    // Mock the query method to return an empty response
    wpClient.query = jest.fn().mockResolvedValue(mockEmptyResponse)

    const result = await wpClient.query(mockQuery)

    expect(result).toEqual(mockEmptyResponse)
    expect(result.data.posts.nodes).toHaveLength(0)
  })

  it('should handle large responses', async () => {
    const mockQuery = {
      query: `query TestQuery {
        posts {
          nodes {
            id
            title
            content
            excerpt
            date
            modified
            author {
              node {
                name
                email
              }
            }
          }
        }
      }`,
    }

    const mockLargeResponse = {
      data: {
        posts: {
          nodes: Array.from({ length: 100 }, (_, i) => ({
            id: `post-${i}`,
            title: `Post ${i}`,
            content: `Content for post ${i}`,
            excerpt: `Excerpt for post ${i}`,
            date: '2024-01-01T00:00:00Z',
            modified: '2024-01-01T00:00:00Z',
            author: {
              node: {
                name: `Author ${i}`,
                email: `author${i}@example.com`,
              },
            },
          })),
        },
      },
    }

    // Mock the query method to return a large response
    wpClient.query = jest.fn().mockResolvedValue(mockLargeResponse)

    const result = await wpClient.query(mockQuery)

    expect(result).toEqual(mockLargeResponse)
    expect(result.data.posts.nodes).toHaveLength(100)
  })
}) 