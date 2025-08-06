import { POST } from '../venue-hire/route'

// Mock the email function
jest.mock('@/lib/email', () => ({
  sendEmailViaMailgun: jest.fn(),
}))

import { sendEmailViaMailgun } from '@/lib/email'

describe('Venue Hire API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle successful venue hire submission', async () => {
    const mockEmailResponse = { success: true, message: 'Email sent successfully' }
    ;(sendEmailViaMailgun as jest.Mock).mockResolvedValue(mockEmailResponse)

    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
      phone: '1234567890',
      organization: 'Test Organization',
      eventDate: '2024-03-15',
      eventTime: '19:00',
      attendees: '50',
      eventType: 'Meeting',
      requirements: 'Test requirements',
    })
  })

  it('should handle email sending failure', async () => {
    const mockEmailResponse = { success: false, message: 'Failed to send email' }
    ;(sendEmailViaMailgun as jest.Mock).mockResolvedValue(mockEmailResponse)

    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    formData.append('phone', '')
    formData.append('organization', '')
    formData.append('eventDate', '')
    formData.append('eventTime', '')
    formData.append('attendees', '')
    formData.append('eventType', '')
    formData.append('requirements', '')

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should handle invalid phone format', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('phone', 'invalid-phone')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should handle invalid date format', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', 'invalid-date')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.message).toContain('validation')
  })

  it('should handle invalid attendees number', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', 'invalid-number')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    formData.append('phone', '1234567890')
    formData.append('organization', 'Test Organization')
    formData.append('eventDate', '2024-03-15')
    formData.append('eventTime', '19:00')
    formData.append('attendees', '50')
    formData.append('eventType', 'Meeting')
    formData.append('requirements', 'Test requirements')

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    formData.append('email', 'test@example.com')
    // Missing other required fields

    const request = new Request('http://localhost:3000/api/venue-hire', {
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
    formData.append('phone', '  1234567890  ')
    formData.append('organization', '  Test Organization  ')
    formData.append('eventDate', '  2024-03-15  ')
    formData.append('eventTime', '  19:00  ')
    formData.append('attendees', '  50  ')
    formData.append('eventType', '  Meeting  ')
    formData.append('requirements', '  Test requirements  ')

    const request = new Request('http://localhost:3000/api/venue-hire', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(sendEmailViaMailgun).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      organization: 'Test Organization',
      eventDate: '2024-03-15',
      eventTime: '19:00',
      attendees: '50',
      eventType: 'Meeting',
      requirements: 'Test requirements',
    })
  })
}) 