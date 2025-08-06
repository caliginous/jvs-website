import {
  extractEventDateFromTitle,
  getEventDate,
  formatDate,
  parseTicketTypes,
  decodeHtmlEntities,
  cleanText,
} from '../utils'

describe('Utility Functions', () => {
  describe('extractEventDateFromTitle', () => {
    it('should extract date from title with date format', () => {
      const title = 'Event on 15th March 2024'
      const result = extractEventDateFromTitle(title)
      expect(result).toEqual(new Date(2024, 2, 15)) // March is month 2 (0-indexed)
    })

    it('should extract date from title with different date formats', () => {
      const title = 'Dinner Event - 20th December 2024'
      const result = extractEventDateFromTitle(title)
      expect(result).toEqual(new Date(2024, 11, 20)) // December is month 11 (0-indexed)
    })

    it('should return null for title without date', () => {
      const title = 'Event without date'
      const result = extractEventDateFromTitle(title)
      expect(result).toBeNull()
    })

    it('should handle empty string', () => {
      const result = extractEventDateFromTitle('')
      expect(result).toBeNull()
    })
  })

  describe('getEventDate', () => {
    it('should return eventDate if available', () => {
      const event = {
        title: 'Test Event',
        eventDate: '2024-03-15T00:00:00Z',
      }
      const result = getEventDate(event)
      expect(result).toEqual(new Date('2024-03-15T00:00:00Z'))
    })

    it('should extract date from title if eventDate not available', () => {
      const event = {
        title: 'Event on 20th December 2024',
        eventDate: undefined,
      }
      const result = getEventDate(event)
      expect(result).toEqual(new Date(2024, 11, 20))
    })

    it('should return null if no date available', () => {
      const event = {
        title: 'Event without date',
        eventDate: undefined,
      }
      const result = getEventDate(event)
      expect(result).toBeNull()
    })
  })

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = new Date('2024-03-15T12:00:00Z')
      const result = formatDate(date)
      expect(result).toHaveProperty('day', 15)
      expect(result).toHaveProperty('year', 2024)
      expect(result).toHaveProperty('fullDate')
    })

    it('should handle different date formats', () => {
      const date = new Date('2024-12-20T18:30:00Z')
      const result = formatDate(date)
      expect(result).toHaveProperty('day', 20)
      expect(result).toHaveProperty('year', 2024)
      expect(result).toHaveProperty('time')
    })

    it('should handle null input', () => {
      expect(() => formatDate(null as any)).toThrow()
    })
  })

  describe('parseTicketTypes', () => {
    it('should parse ticket types from eventPrice', () => {
      const event = {
        eventPrice: '£25',
        purchasable: true,
      } as any
      const result = parseTicketTypes(event)
      expect(result).toEqual([
        { label: 'Standard Ticket', type: 'standard', price: '25', available: true },
      ])
    })

    it('should handle free events', () => {
      const event = {
        eventPrice: 'Free',
        purchasable: true,
      } as any
      const result = parseTicketTypes(event)
      expect(result).toEqual([
        { label: 'Free Ticket', type: 'free', price: '0', available: true },
      ])
    })

    it('should handle events without price', () => {
      const event = {
        eventPrice: null,
        purchasable: true,
      } as any
      const result = parseTicketTypes(event)
      expect(result).toEqual([
        { label: 'Free Ticket', type: 'free', price: '0', available: true },
      ])
    })

    it('should return empty array for non-purchasable events', () => {
      const event = {
        eventPrice: '£25',
        purchasable: false,
      } as any
      const result = parseTicketTypes(event)
      expect(result).toEqual([
        { label: 'Standard Ticket', type: 'standard', price: '25', available: false },
      ])
    })

    it('should prioritize ticketTypes field', () => {
      const event = {
        eventPrice: '£25',
        purchasable: true,
        ticketTypes: [
          { label: 'VIP', type: 'vip', price: '50', available: true },
        ],
      } as any
      const result = parseTicketTypes(event)
      expect(result).toEqual([
        { label: 'VIP', type: 'vip', price: '50', available: true },
      ])
    })
  })

  describe('decodeHtmlEntities', () => {
    it('should decode HTML entities', () => {
      const text = '&amp; &lt; &gt; &quot; &#39;'
      const result = decodeHtmlEntities(text)
      expect(result).toBe('& < > " \'')
    })

    it('should handle text without HTML entities', () => {
      const text = 'Plain text without entities'
      const result = decodeHtmlEntities(text)
      expect(result).toBe('Plain text without entities')
    })

    it('should handle empty string', () => {
      const result = decodeHtmlEntities('')
      expect(result).toBe('')
    })

    it('should handle null input', () => {
      const result = decodeHtmlEntities(null as any)
      expect(result).toBe('')
    })
  })

  describe('cleanText', () => {
    it('should clean text by removing HTML tags and decoding entities', () => {
      const text = '<p>&amp; Clean &lt;text&gt;</p>'
      const result = cleanText(text)
      expect(result).toBe('& Clean <text>')
    })

    it('should handle text with HTML tags', () => {
      const text = '<div>Hello <strong>World</strong></div>'
      const result = cleanText(text)
      expect(result).toBe('Hello World')
    })

    it('should handle null input', () => {
      const result = cleanText(null as any)
      expect(result).toBe('')
    })

    it('should handle empty string', () => {
      const result = cleanText('')
      expect(result).toBe('')
    })
  })
}) 