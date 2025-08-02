import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import EventCard from '../EventCard'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

const mockEvent = {
  id: '1',
  name: 'Test Event',
  price: '25',
  eventDate: '2024-12-15T19:00:00Z', // Future date
  eventEndDate: '2024-12-15T22:00:00Z',
  eventVenue: 'Test Venue',
  eventPrice: '25',
  stockQuantity: 10,
  stockStatus: 'instock',
  purchasable: true,
  jvsTestField: 'Member: £20, Non-Member: £25',
  slug: 'test-event',
}

const mockSoldOutEvent = {
  ...mockEvent,
  stockQuantity: 0,
  stockStatus: 'outofstock',
  purchasable: false,
}

const mockPastEvent = {
  ...mockEvent,
  eventDate: '2024-01-15T19:00:00Z', // Past date
  eventEndDate: '2024-01-15T22:00:00Z',
}

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText(/Friday, 15 December 2024/)).toBeInTheDocument()
  })

  it('shows available tickets status when tickets are available', () => {
    render(<EventCard event={mockEvent} />)

    expect(screen.getByText(/🟢 10 tickets available/)).toBeInTheDocument()
    expect(screen.queryByText(/🔴 Sold Out/)).not.toBeInTheDocument()
  })

  it('shows sold out status when no tickets available', () => {
    render(<EventCard event={mockSoldOutEvent} />)

    expect(screen.getByText(/🔴 Sold Out/)).toBeInTheDocument()
    expect(screen.queryByText(/🟢.*tickets available/)).not.toBeInTheDocument()
  })

  it('shows "Event Ended" for past events', () => {
    render(<EventCard event={mockPastEvent} />)

    expect(screen.getByText('Event Ended')).toBeInTheDocument()
    expect(screen.queryByText(/Buy Tickets/)).not.toBeInTheDocument()
  })

  it('shows "Details" button for all events', () => {
    render(<EventCard event={mockEvent} />)

    const detailsButton = screen.getByRole('link', { name: /details/i })
    expect(detailsButton).toBeInTheDocument()
    expect(detailsButton).toHaveAttribute('href', '/events/1')
  })

  it('shows "Buy Tickets" button for upcoming events with tickets', () => {
    render(<EventCard event={mockEvent} />)

    const buyTicketsButton = screen.getByRole('link', { name: /buy tickets/i })
    expect(buyTicketsButton).toBeInTheDocument()
    expect(buyTicketsButton).toHaveAttribute('href', '/events/1/tickets')
  })

  it('shows "RSVP" button for free events', () => {
    const freeEvent = {
      ...mockEvent,
      eventPrice: 'Free',
    }

    render(<EventCard event={freeEvent} />)

    const rsvpButton = screen.getByRole('link', { name: /rsvp/i })
    expect(rsvpButton).toBeInTheDocument()
    expect(rsvpButton).toHaveAttribute('href', '/events/1/tickets')
  })

  it('handles events without venue', () => {
    const eventWithoutVenue = {
      ...mockEvent,
      eventVenue: '',
    }

    render(<EventCard event={eventWithoutVenue} />)

    expect(screen.queryByText('Test Venue')).not.toBeInTheDocument()
  })

  it('handles events without price', () => {
    const eventWithoutPrice = {
      ...mockEvent,
      eventPrice: '',
    }

    render(<EventCard event={eventWithoutPrice} />)

    expect(screen.getByText('Free')).toBeInTheDocument()
  })

  it('handles events without date', () => {
    const eventWithoutDate = {
      ...mockEvent,
      eventDate: '',
    }

    render(<EventCard event={eventWithoutDate} />)

    expect(screen.queryByText(/📅/)).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for layout', () => {
    render(<EventCard event={mockEvent} />)

    const card = screen.getByText('Test Event').closest('div')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden')
  })

  it('handles long event names gracefully', () => {
    const eventWithLongName = {
      ...mockEvent,
      name: 'This is a very long event name that should be handled properly by the component',
    }

    render(<EventCard event={eventWithLongName} />)

    expect(screen.getByText(eventWithLongName.name)).toBeInTheDocument()
  })

  it('shows "Free Event" badge for free events', () => {
    const freeEvent = {
      ...mockEvent,
      eventPrice: 'Free',
    }

    render(<EventCard event={freeEvent} />)

    expect(screen.getByText('Free Event')).toBeInTheDocument()
  })

  it('does not show ticket button for past events', () => {
    render(<EventCard event={mockPastEvent} />)

    expect(screen.queryByText(/Buy Tickets/)).not.toBeInTheDocument()
    expect(screen.queryByText(/RSVP/)).not.toBeInTheDocument()
  })
}) 