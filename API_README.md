# Tessera Events API

A RESTful API for accessing event information from the Tessera ticketing system.

## 🌟 NEW: Event Descriptions & Enhanced Venue Information

Events now include comprehensive descriptions and venue details:
- **Event Description**: Detailed information about each event (up to 200 words)
- **Venue Name**: The name of the venue
- **Address**: Street address (if available)
- **City**: City location (if available)  
- **Postcode**: Postal code (if available)

This allows third-party applications to display event descriptions, locations, and provide better user experience.

## Quick Start

### Bash
```bash
curl -X GET "https://tickets.jvs.org.uk/api/public/events" \
  -H "Accept: application/json"
```

### JavaScript
```javascript
const response = await fetch('https://tickets.jvs.org.uk/api/public/events');
const events = await response.json();

// Display venue information
events.forEach(event => {
  if (event.venue) {
    console.log(`${event.title} at ${event.venue.name}`);
    if (event.venue.address) {
      console.log(`Address: ${event.venue.address}, ${event.venue.city || ''} ${event.venue.postcode || ''}`);
    }
  }
});
```

### Python
```python
import requests

response = requests.get('https://tickets.jvs.org.uk/api/public/events')
events = response.json()

# Show venue details
for event in events:
    if event.get('venue'):
        venue = event['venue']
        print(f"{event['title']} at {venue['name']}")
        if venue.get('address'):
            location = f"{venue['address']}"
            if venue.get('city'):
                location += f", {venue['city']}"
            if venue.get('postcode'):
                location += f" {venue['postcode']}"
            print(f"Location: {location}")
```

## Response Format

```json
[
  {
    "id": 1,
    "title": "Jewish Vegan Society Annual Dinner",
    "description": "Join us for an evening of celebration and community building. This annual dinner brings together members of the Jewish Vegan Society to share stories, enjoy delicious plant-based cuisine, and strengthen our commitment to ethical eating and environmental stewardship.",
    "nextDate": "2024-12-25T18:00:00.000Z",
    "minPrice": 25.00,
    "seatType": "free",
    "coverImage": "https://example.com/image.jpg",
    "venue": {
      "name": "Community Hall",
      "address": "123 Main Street",
      "city": "London",
      "postcode": "SW1A 1AA"
    },
    "ticketAvailability": {
      "total": 100,
      "available": 75,
      "sold": 25,
      "percentageRemaining": 75,
      "hasGlobalLimit": true
    },
    "categories": [
      {
        "id": 1,
        "name": "Adult",
        "price": 25.00,
        "color": "#4CAF50",
        "maxAmount": 50,
        "sold": 20,
        "available": 30,
        "isAvailable": true
      }
    ],
    "hasAvailableTickets": true,
    "isSoldOut": false
  }
]
```

## Field Descriptions

### Event Information
- **id**: Unique identifier for the event
- **title**: Name of the event
- **description**: Detailed event description (up to 200 words, optional)
- **nextDate**: ISO 8601 date of the next occurrence
- **minPrice**: Lowest ticket price available
- **seatType**: Seating arrangement type (`free` or `seatmap`)
- **coverImage**: URL to event cover image (if available)

### Venue Information
- **venue.name**: Name of the venue (required)
- **venue.address**: Street address (optional)
- **venue.city**: City location (optional)
- **venue.postcode**: Postal code (optional)

### Ticket Availability
- **ticketAvailability.total**: Total capacity
- **ticketAvailability.available**: Currently available tickets
- **ticketAvailability.sold**: Already sold tickets
- **ticketAvailability.percentageRemaining**: Percentage remaining (0-100)
- **ticketAvailability.hasGlobalLimit**: Whether global limit applies

### Category Breakdown
- **categories**: Array of ticket types with individual availability
- **id**: Category identifier
- **name**: Category name (e.g., "Adult", "Child")
- **price**: Ticket price
- **color**: Display color (for seat maps)
- **maxAmount**: Maximum tickets available
- **sold**: Tickets sold in this category
- **available**: Tickets available in this category
- **isAvailable**: Whether category has available tickets

## Use Cases

### Event Discovery
Display upcoming events with venue locations for users to browse.

### Location-Based Services
Show events near specific areas using venue city/postcode information.

### Calendar Integration
Include venue details when adding events to user calendars.

### Mobile Apps
Provide directions to events using venue address information.

## Integration Examples

### WordPress Plugin
```php
$response = wp_remote_get('https://tickets.jvs.org.uk/api/public/events');
$events = json_decode(wp_remote_retrieve_body($response), true);

foreach ($events as $event) {
    $venue_info = '';
    if ($event['venue']) {
        $venue_info = $event['venue']['name'];
        if ($event['venue']['city']) {
            $venue_info .= ' - ' . $event['venue']['city'];
        }
    }
    
    echo '<div class="event">';
    echo '<h3>' . esc_html($event['title']) . '</h3>';
    if ($venue_info) {
        echo '<p class="venue">📍 ' . esc_html($venue_info) . '</p>';
    }
    echo '</div>';
}
```

### React Component
```jsx
function EventList() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch('https://tickets.jvs.org.uk/api/public/events')
      .then(res => res.json())
      .then(setEvents);
  }, []);
  
  return (
    <div className="events">
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          {event.venue && (
            <div className="venue-info">
              <span className="icon">📍</span>
              <span>{event.venue.name}</span>
              {event.venue.city && <span> - {event.venue.city}</span>}
            </div>
          )}
          <div className="availability">
            {event.ticketAvailability.available} tickets available
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Rate Limiting

Currently no rate limits are enforced, but please be respectful and cache responses when possible.

## Error Handling

The API returns standard HTTP status codes:
- **200**: Success
- **500**: Server error

## Changelog

### v1.3.0 (Current)
- ✨ Added event descriptions (up to 200 words)
- 📝 Enhanced event information for better user engagement
- 🌍 Comprehensive venue information
- 📍 Venue details include name, address, city, and postcode
- 📍 Enhanced location display for better user experience

### v1.1.0
- ✨ Added ticket availability information
- 🎫 Global ticket limits support
- 📊 Real-time availability per category

### v1.0.0
- 🎉 Initial API release
- 📅 Basic event information
- 💰 Ticket pricing
- 🎨 Category management
