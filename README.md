# JVS Website

The official website for the Jewish Vegetarian Society (JVS) - a modern Next.js application with headless CMS integration, event ticketing, and e-commerce capabilities.

**Live Site:** [jvs.org.uk](https://jvs.org.uk)

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity (primary) + WordPress GraphQL (legacy content)
- **Database:** Neon (PostgreSQL) for events
- **Payments:** Stripe
- **Deployment:** Vercel
- **Testing:** Playwright (E2E), Jest (Unit)

## Features

- **Articles & Blog** - Content from WordPress/Sanity with full-text search
- **Recipes** - 260+ vegan recipes with filtering and search
- **Events** - Integration with Tessera ticketing system
- **Magazine Archive** - Searchable PDF magazine archive
- **Membership** - Subscription and donation handling
- **Venue Hire** - Contact form for venue bookings
- **Resources** - Festival packs, FAQs, caterer/clergy directories

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/caliginous/jvs-website.git
cd jvs-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# WordPress GraphQL (legacy content)
WP_GRAPHQL_URL=https://www.jvs.org.uk/graphql
WP_API_URL=https://www.jvs.org.uk/wp-json

# Sanity CMS
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity Feature Flags
SANITY_RECIPES_ENABLED=true
SANITY_AGGREGATION_ENABLED=true

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Tessera Events API
TESSERA_API_URL=https://tickets.jvs.org.uk/api

# Revalidation Secrets
REVALIDATION_SECRET=your-secret
REVALIDATE_RECIPES_SECRET=your-secret
REVALIDATE_ARTICLES_SECRET=your-secret

# Cloudflare Turnstile (spam protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

See [env-reference.md](./env-reference.md) for full documentation.

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── articles/      # Articles API
│   │   ├── checkout/      # Stripe checkout
│   │   ├── contact/       # Contact form handler
│   │   ├── newsletter/    # Newsletter signup
│   │   ├── revalidate-*/  # ISR revalidation endpoints
│   │   └── ...
│   ├── articles/          # Blog/articles pages
│   ├── events/            # Events and ticketing
│   ├── magazine/          # Magazine archive
│   ├── recipes/           # Recipe pages
│   ├── resources/         # Resource pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                   # Utilities and API clients
│   ├── articles/         # Article fetching logic
│   ├── recipes/          # Recipe fetching logic
│   ├── api.ts            # General API utilities
│   ├── queries.ts        # GraphQL queries
│   ├── sanity.ts         # Sanity client
│   ├── stripe.ts         # Stripe utilities
│   ├── tessera-api.ts    # Tessera events API
│   ├── types.ts          # TypeScript interfaces
│   └── wpClient.ts       # WordPress/Apollo client
├── hooks/                 # Custom React hooks
└── utils/                 # Helper functions

scripts/                   # Migration and utility scripts
├── migrate-wp-articles.js
├── migrate-wp-recipes.js
├── mirror-images-to-cdn.js
└── ...

public/                    # Static assets
├── images/
└── magazine/

tests/                     # Test files
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Testing
npm run test:smoke       # Run smoke tests
npm run test:e2e         # Run E2E tests
npm run test:smoke:init  # Install Playwright browsers

# Content Migration
npm run migrate:articles # Migrate WordPress articles to Sanity
npm run migrate:recipes  # Migrate WordPress recipes to Sanity
npm run mirror:images    # Mirror images to CDN
```

## API Endpoints

### Public APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/articles` | List all articles |
| `GET /api/articles/[slug]` | Get single article |
| `GET /api/recipes` | List all recipes |
| `GET /api/magazine` | Search magazine archive |

### Revalidation APIs

| Endpoint | Description |
|----------|-------------|
| `POST /api/revalidate-articles` | Revalidate article pages |
| `POST /api/revalidate-recipes` | Revalidate recipe pages |
| `POST /api/revalidate-events` | Revalidate event pages |
| `POST /api/revalidate-static` | Revalidate static pages |

See [API_README.md](./API_README.md) for detailed API documentation.

## Content Management

### Sanity CMS

The primary CMS for new content. Access the studio at `/studio` or configure your own Sanity project.

Content types:
- Articles
- Recipes
- Static pages
- Homepage settings

### WordPress (Legacy)

Legacy content is fetched via GraphQL from the WordPress site. New content should be created in Sanity.

## Events Integration

Events are managed through the Tessera ticketing system. The website fetches event data via the Tessera API.

See [EVENT_REVALIDATION_GUIDE.md](./EVENT_REVALIDATION_GUIDE.md) for setup details.

## Deployment

### Vercel (Primary)

The site is deployed on Vercel with automatic deployments from the `main` branch.

```bash
# Deploy to Vercel
vercel --prod
```

### Environment Setup

1. Add all environment variables in Vercel dashboard
2. Configure revalidation secrets
3. Set up Stripe webhooks pointing to `/api/webhooks/stripe`

See [setup-vercel.md](./setup-vercel.md) for detailed instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [API_README.md](./API_README.md) | Tessera Events API documentation |
| [WORKING_IMPLEMENTATION_DOCUMENTATION.md](./WORKING_IMPLEMENTATION_DOCUMENTATION.md) | Detailed technical implementation |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Quick reference for common tasks |
| [EVENT_REVALIDATION_GUIDE.md](./EVENT_REVALIDATION_GUIDE.md) | Event revalidation setup |
| [env-reference.md](./env-reference.md) | Environment variables reference |
| [SANITY_ARTICLE_SCHEMA.md](./SANITY_ARTICLE_SCHEMA.md) | Sanity schema documentation |
| [CORS-SOLUTION-CHECKOUT-20250806.md](./CORS-SOLUTION-CHECKOUT-20250806.md) | CORS configuration for checkout |

## Testing

```bash
# Install Playwright browsers
npm run test:e2e:init

# Run E2E tests
npm run test:e2e

# Run smoke tests
npm run test:smoke
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Create a pull request

## License

Private - Jewish Vegetarian Society
