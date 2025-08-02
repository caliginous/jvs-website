import { sendEmailViaMailgun } from '../email'

// Mock Mailgun
jest.mock('mailgun.js', () => {
  return jest.fn().mockImplementation(() => ({
    client: jest.fn().mockReturnValue({
      messages: {
        create: jest.fn(),
      },
    }),
  }))
})

import Mailgun from 'mailgun.js'

describe('Email Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Ensure environment variable is set for tests
    process.env.MAILGUN_API_KEY = 'test-mailgun-key'
  })

  describe('sendEmailViaMailgun', () => {
    const mockEmailData = {
      from: 'Test User',
      fromEmail: 'test@example.com',
      to: 'admin@jvs.org.uk',
      subject: 'Test Subject',
      text: 'Test message',
    }

    it('should send email successfully', async () => {
      const mockMailgunResponse = { id: 'test-id', message: 'Queued. Thank you.' }
      const mockCreate = jest.fn().mockResolvedValue(mockMailgunResponse)
      
      const mockClient = jest.fn().mockReturnValue({
        messages: {
          create: mockCreate,
        },
      })

      const mockMailgun = jest.fn().mockImplementation(() => ({
        client: mockClient,
      }))

      ;(Mailgun as unknown as jest.Mock).mockImplementation(mockMailgun)

      const result = await sendEmailViaMailgun(mockEmailData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email sent successfully')
      expect(mockCreate).toHaveBeenCalledWith('jvs.org.uk', {
        from: 'Test User <test@example.com>',
        to: ['admin@jvs.org.uk'],
        subject: 'Test Subject',
        text: 'Test message',
        'h:Reply-To': 'test@example.com',
      })
    })

    it('should handle API error response', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'))
      
      const mockClient = jest.fn().mockReturnValue({
        messages: {
          create: mockCreate,
        },
      })

      const mockMailgun = jest.fn().mockImplementation(() => ({
        client: mockClient,
      }))

      ;(Mailgun as unknown as jest.Mock).mockImplementation(mockMailgun)

      const result = await sendEmailViaMailgun(mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('API Error')
    })

    it('should handle missing environment variables', async () => {
      const originalEnv = process.env.MAILGUN_API_KEY
      delete process.env.MAILGUN_API_KEY

      const result = await sendEmailViaMailgun(mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email service not configured')

      process.env.MAILGUN_API_KEY = originalEnv
    })

    it('should handle network error', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('Network error'))
      
      const mockClient = jest.fn().mockReturnValue({
        messages: {
          create: mockCreate,
        },
      })

      const mockMailgun = jest.fn().mockImplementation(() => ({
        client: mockClient,
      }))

      ;(Mailgun as unknown as jest.Mock).mockImplementation(mockMailgun)

      const result = await sendEmailViaMailgun(mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle unknown error', async () => {
      const mockCreate = jest.fn().mockRejectedValue('Unknown error')
      
      const mockClient = jest.fn().mockReturnValue({
        messages: {
          create: mockCreate,
        },
      })

      const mockMailgun = jest.fn().mockImplementation(() => ({
        client: mockClient,
      }))

      ;(Mailgun as unknown as jest.Mock).mockImplementation(mockMailgun)

      const result = await sendEmailViaMailgun(mockEmailData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Unknown error occurred')
    })

    it('should use correct Mailgun configuration', async () => {
      const mockCreate = jest.fn().mockResolvedValue({ id: 'test-id' })
      
      const mockClient = jest.fn().mockReturnValue({
        messages: {
          create: mockCreate,
        },
      })

      const mockMailgun = jest.fn().mockImplementation(() => ({
        client: mockClient,
      }))

      ;(Mailgun as unknown as jest.Mock).mockImplementation(mockMailgun)

      await sendEmailViaMailgun(mockEmailData)

      expect(mockClient).toHaveBeenCalledWith({
        username: 'api',
        key: 'test-mailgun-key',
        url: 'https://api.eu.mailgun.net',
      })
    })
  })
}) 