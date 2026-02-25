import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DynamicEventCard from '../DynamicEventCard'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

const mockEvent = {
  id: '1',
  name: 'Test Event',
  eventDate: '2024-03-15',
  eventVenue: 'Test Venue',
  eventPrice: '25',
  stockQuantity: 10,
  stockStatus: 'instock',
  purchasable: true,
  jvsTestField: 'Member: £20, Non-Member: £25',
  slug: 'test-event',
  description: 'Test event description',
  featuredImageUrl: 'https://example.com/image.jpg',
}

const mockSoldOutEvent = {
  ...mockEvent,
  stockQuantity: 0,
  stockStatus: 'outofstock',
  purchasable: false,
}

describe('DynamicEventCard', () => {
  it('renders event information correctly', () => {
    render(<DynamicEventCard event={mockEvent} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
    expect(screen.getByText('£25')).toBeInTheDocument()
    expect(screen.getByText('15th March 2024')).toBeInTheDocument()
  })

  it('shows available status when tickets are available', () => {
    render(<DynamicEventCard event={mockEvent} />)

    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.queryByText('Sold Out')).not.toBeInTheDocument()
  })

  it('shows sold out status when no tickets available', () => {
    render(<DynamicEventCard event={mockSoldOutEvent} />)

    expect(screen.getByText('Sold Out')).toBeInTheDocument()
    expect(screen.queryByText('Available')).not.toBeInTheDocument()
  })

  it('renders ticket types when available', () => {
    render(<DynamicEventCard event={mockEvent} />)

    expect(screen.getByText('Member: £20')).toBeInTheDocument()
    expect(screen.getByText('Non-Member: £25')).toBeInTheDocument()
  })

  it('shows "View Details" button for available events', () => {
    render(<DynamicEventCard event={mockEvent} />)

    const viewDetailsButton = screen.getByRole('link', { name: /view details/i })
    expect(viewDetailsButton).toBeInTheDocument()
    expect(viewDetailsButton).toHaveAttribute('href', '/events/test-event')
  })

  it('shows "Get Tickets" button for available events', () => {
    render(<DynamicEventCard event={mockEvent} />)

    const getTicketsButton = screen.getByRole('link', { name: /get tickets/i })
    expect(getTicketsButton).toBeInTheDocument()
    expect(getTicketsButton).toHaveAttribute('href', '/events/test-event/tickets')
  })

  it('renders event description when available', () => {
    render(<DynamicEventCard event={mockEvent} />)

    expect(screen.getByText('Test event description')).toBeInTheDocument()
  })

  it('renders featured image when available', () => {
    render(<DynamicEventCard event={mockEvent} />)

    const image = screen.getByAltText('Test Event')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('handles events without description', () => {
    const eventWithoutDescription = {
      ...mockEvent,
      description: null,
    }

    render(<DynamicEventCard event={eventWithoutDescription} />)

    expect(screen.queryByText('Test event description')).not.toBeInTheDocument()
  })

  it('handles events without featured image', () => {
    const eventWithoutImage = {
      ...mockEvent,
      featuredImageUrl: null,
    }

    render(<DynamicEventCard event={eventWithoutImage} />)

    expect(screen.queryByAltText('Test Event')).not.toBeInTheDocument()
  })

  it('handles events without ticket types', () => {
    const eventWithoutTickets = {
      ...mockEvent,
      jvsTestField: null,
    }

    render(<DynamicEventCard event={eventWithoutTickets} />)

    expect(screen.queryByText(/Member:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Non-Member:/)).not.toBeInTheDocument()
  })

  it('handles events without venue', () => {
    const eventWithoutVenue = {
      ...mockEvent,
      eventVenue: null,
    }

    render(<DynamicEventCard event={eventWithoutVenue} />)

    expect(screen.queryByText('Test Venue')).not.toBeInTheDocument()
  })

  it('handles events without price', () => {
    const eventWithoutPrice = {
      ...mockEvent,
      eventPrice: null,
    }

    render(<DynamicEventCard event={eventWithoutPrice} />)

    expect(screen.queryByText('£25')).not.toBeInTheDocument()
  })

  it('handles events without date', () => {
    const eventWithoutDate = {
      ...mockEvent,
      eventDate: null,
    }

    render(<DynamicEventCard event={eventWithoutDate} />)

    expect(screen.queryByText('15th March 2024')).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for layout', () => {
    render(<DynamicEventCard event={mockEvent} />)

    const card = screen.getByRole('article')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden')
  })

  it('maintains consistent card height', () => {
    render(<DynamicEventCard event={mockEvent} />)

    const card = screen.getByRole('article')
    expect(card).toHaveClass('h-full', 'flex', 'flex-col')
  })
}) 