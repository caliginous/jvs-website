# JVS Website - Quick Reference

**Date:** August 1, 2025  
**Working Version:** b63f821f-920d-4772-8898-4aedd6362fac  
**URL:** https://jvs-website.dan-794.workers.dev  

## ✅ Working Features

### Articles (100 pages generated)
- **File:** `src/app/articles/[slug]/page.tsx`
- **Client:** Apollo Client (`src/lib/wpClient.ts`)
- **Queries:** `src/lib/queries.ts` (ARTICLES_QUERY, ARTICLE_QUERY)
- **Strategy:** Static generation with fallback handling

### Recipes (264+ pages generated)
- **File:** `src/app/recipes/[slug]/page.tsx`
- **API:** `src/lib/api.ts` (getRecipeBySlug, fetchRecipeSlugs)
- **Strategy:** Static generation with KV caching

### Events (Multiple pages generated)
- **File:** `src/app/events/[slug]/page.tsx`
- **Tickets:** `src/app/events/[slug]/tickets/page.tsx` (Edge Runtime)
- **API:** `src/lib/api.ts` (getEventBySlug, fetchEventSlugs)
- **Strategy:** Mixed static/dynamic generation

## 🔧 Key Configuration Files

### Build & Deploy
```bash
# Build
npx @cloudflare/next-on-pages

# Deploy
echo "_worker.js" > .vercel/output/static/.assetsignore
npx wrangler deploy --env=production
```

### Environment Variables
- `WP_GRAPHQL_URL`: https://jvs.org.uk/graphql
- `WP_API_URL`: https://jvs.org.uk/wp-json

### Wrangler Config
- **Main:** `.vercel/output/static/_worker.js/index.js`
- **Assets:** `.vercel/output/static`
- **KV:** `JVS_SECRETS` (7628564cb1e947908e46a7a47373c23b)
- **D1:** `jvs-magazine-db` (2b2ca51b-2571-486a-b569-d595f75f9fd8)

## 🚨 Critical Success Factors

1. **Apollo Client with Fallback:** Proxy → Direct WordPress GraphQL
2. **Static Generation:** `dynamic = 'force-static'` for articles/recipes
3. **Edge Runtime:** `runtime = 'edge'` for event tickets
4. **Error Handling:** Fallback slugs prevent build failures
5. **KV Caching:** 10-minute TTL for performance

## 🔍 Debug Commands

```bash
# Check article pages
ls -la .vercel/output/static/articles/ | wc -l

# Test GraphQL
curl -X POST https://jvs.org.uk/graphql -H "Content-Type: application/json" -d '{"query":"{posts(first:1){nodes{slug}}}"}'

# View logs
npx wrangler tail --format pretty
```

## 📁 Essential Files

- `src/lib/wpClient.ts` - Apollo Client with fallback logic
- `src/lib/queries.ts` - GraphQL query definitions
- `src/lib/api.ts` - Recipe/Event data fetching with KV cache
- `src/lib/types.ts` - TypeScript interfaces
- `wrangler.toml` - Cloudflare Workers configuration

## 🆘 Rollback Process

1. Copy working files from this version
2. Run `npx @cloudflare/next-on-pages`
3. Run `npx wrangler deploy --env=production`
4. Verify all pages work

---

**Full Documentation:** See `WORKING_IMPLEMENTATION_DOCUMENTATION.md` 