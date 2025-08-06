import { POST } from '../contact/route'

// Mock the email function
jest.mock('@/lib/email', () => ({
  sendEmailViaMailgun: jest.fn(),
}))

import { sendEmailViaMailgun } from '@/lib/email'

describe('Contact API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle successful email submission', async () => {
    const mockEmailResponse = { success: true, message: 'Email sent successfully' }
    ;(sendEmailViaMailgun as jest.Mock).mockResolvedValue(mockEmailResponse)

    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('message', 'Test message')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Email sent successfully')
    expect(sendEmailViaMailgun).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
  })

  it('should handle email sending failure', async () => {
    const mockEmailResponse = { success: false, message: 'Failed to send email' }
    ;(sendEmailViaMailgun as jest.Mock).mockResolvedValue(mockEmailResponse)

    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('message', 'Test message')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toBe('Failed to send email')
  })

  it('should handle missing required fields', async () => {
    const formData = new FormData()
    formData.append('name', '')
    formData.append('email', '')
    formData.append('message', '')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should handle invalid email format', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'invalid-email')
    formData.append('message', 'Test message')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should handle email function throwing error', async () => {
    ;(sendEmailViaMailgun as jest.Mock).mockRejectedValue(new Error('Network error'))

    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('message', 'Test message')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.message).toContain('error')
  })

  it('should handle malformed form data', async () => {
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: 'invalid-form-data',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('Invalid request')
  })

  it('should handle partial form data', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    // Missing email and message

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should trim whitespace from form fields', async () => {
    const mockEmailResponse = { success: true, message: 'Email sent successfully' }
    ;(sendEmailViaMailgun as jest.Mock).mockResolvedValue(mockEmailResponse)

    const formData = new FormData()
    formData.append('name', '  Test User  ')
    formData.append('email', '  test@example.com  ')
    formData.append('message', '  Test message  ')

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(sendEmailViaMailgun).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
    })
  })
}) 