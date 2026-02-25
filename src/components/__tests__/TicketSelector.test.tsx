import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TicketSelector from '../TicketSelector'

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({
    redirectToCheckout: jest.fn(),
  }),
  useElements: () => ({}),
}))

const mockTicketTypes = [
  { label: 'Member', price: '20', type: 'Member', available: true },
  { label: 'Non-Member', price: '25', type: 'Non-Member', available: true },
  { label: 'Student', price: '15', type: 'Student', available: false },
]

const mockEvent = {
  id: '1',
  name: 'Test Event',
  eventDate: '2024-03-15',
  eventVenue: 'Test Venue',
  eventPrice: '25',
  stockQuantity: 10,
  stockStatus: 'instock',
  purchasable: true,
  jvsTestField: 'Member: £20, Non-Member: £25, Student: £15 (Sold Out)',
  slug: 'test-event',
}

describe('TicketSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders ticket types correctly', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    expect(screen.getByText('Member')).toBeInTheDocument()
    expect(screen.getByText('Non-Member')).toBeInTheDocument()
    expect(screen.getByText('Student')).toBeInTheDocument()
    expect(screen.getByText('£20')).toBeInTheDocument()
    expect(screen.getByText('£25')).toBeInTheDocument()
    expect(screen.getByText('£15')).toBeInTheDocument()
  })

  it('shows sold out status for unavailable tickets', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const studentTicket = screen.getByText('Student').closest('div')
    expect(studentTicket).toHaveTextContent('Sold Out')
  })

  it('allows quantity selection for available tickets', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '2')

    expect(memberQuantityInput).toHaveValue(2)
  })

  it('prevents quantity selection for sold out tickets', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const studentQuantityInput = screen.getByLabelText('Student quantity')
    expect(studentQuantityInput).toBeDisabled()
  })

  it('calculates total price correctly', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    const nonMemberQuantityInput = screen.getByLabelText('Non-Member quantity')

    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '2')
    await user.clear(nonMemberQuantityInput)
    await user.type(nonMemberQuantityInput, '1')

    // 2 * £20 + 1 * £25 = £65
    expect(screen.getByText('Total: £65')).toBeInTheDocument()
  })

  it('shows zero total when no tickets selected', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    expect(screen.getByText('Total: £0')).toBeInTheDocument()
  })

  it('handles "Get Tickets" button click', async () => {
    const user = userEvent.setup()
    const mockOnGetTickets = jest.fn()
    
    render(
      <TicketSelector 
        event={mockEvent} 
        ticketTypes={mockTicketTypes} 
        onGetTickets={mockOnGetTickets}
      />
    )

    const getTicketsButton = screen.getByRole('button', { name: /get tickets/i })
    await user.click(getTicketsButton)

    expect(mockOnGetTickets).toHaveBeenCalled()
  })

  it('disables "Get Tickets" button when no tickets selected', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const getTicketsButton = screen.getByRole('button', { name: /get tickets/i })
    expect(getTicketsButton).toBeDisabled()
  })

  it('enables "Get Tickets" button when tickets are selected', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '1')

    const getTicketsButton = screen.getByRole('button', { name: /get tickets/i })
    expect(getTicketsButton).not.toBeDisabled()
  })

  it('handles quantity validation', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    
    // Try to enter negative number
    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '-1')
    
    expect(memberQuantityInput).toHaveValue(0)
  })

  it('handles empty ticket types array', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={[]} />)

    expect(screen.getByText('No tickets available')).toBeInTheDocument()
  })

  it('displays event information', () => {
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(screen.getByText('15th March 2024')).toBeInTheDocument()
    expect(screen.getByText('Test Venue')).toBeInTheDocument()
  })

  it('handles quantity changes correctly', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    
    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '5')
    
    expect(memberQuantityInput).toHaveValue(5)
  })

  it('updates total when quantities change', async () => {
    const user = userEvent.setup()
    render(<TicketSelector event={mockEvent} ticketTypes={mockTicketTypes} />)

    const memberQuantityInput = screen.getByLabelText('Member quantity')
    const nonMemberQuantityInput = screen.getByLabelText('Non-Member quantity')

    // Initial total should be £0
    expect(screen.getByText('Total: £0')).toBeInTheDocument()

    // Add 1 member ticket
    await user.clear(memberQuantityInput)
    await user.type(memberQuantityInput, '1')
    expect(screen.getByText('Total: £20')).toBeInTheDocument()

    // Add 2 non-member tickets
    await user.clear(nonMemberQuantityInput)
    await user.type(nonMemberQuantityInput, '2')
    expect(screen.getByText('Total: £70')).toBeInTheDocument() // £20 + (2 * £25)
  })
}) 