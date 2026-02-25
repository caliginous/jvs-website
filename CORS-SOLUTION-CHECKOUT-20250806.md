# CORS Solution for JVS Checkout Page - January 8, 2025

## Problem Summary

The JVS checkout page at `https://staging.jvs.org.uk/checkout` was failing due to CORS (Cross-Origin Resource Sharing) errors when making GraphQL requests to the Cloudflare Worker API endpoint.

### Original Error
```
Access to fetch at 'https://jvs-website-staging.dan-794.workers.dev/api/graphql' from origin 'https://staging.jvs.org.uk' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

## Root Cause Analysis

The issue was in the `handleGraphQLAPI` function in `worker.js` which:
1. **Rejected all OPTIONS requests** with a 405 "Method not allowed" error
2. **Did not handle CORS preflight requests** properly
3. **Caused browser CORS preflight to fail** before the actual GraphQL request could be made

### Technical Details
- **Frontend Origin**: `https://staging.jvs.org.uk`
- **API Endpoint**: `https://jvs-website-staging.dan-794.workers.dev/api/graphql`
- **Request Method**: POST with `Content-Type: application/json`
- **CORS Flow**: Browser sends OPTIONS preflight → Worker returns 405 → Browser blocks actual POST request

## Solution Implemented

### 1. Added OPTIONS Handler to GraphQL API Function

**File**: `worker.js` (line 179+)
**Function**: `handleGraphQLAPI(request, env)`

```javascript
async function handleGraphQLAPI(request, env) {
  console.log("🔍 [GRAPHQL API] Method:", request.method);
  
  // Handle OPTIONS preflight request FIRST
  if (request.method === "OPTIONS") {
    console.log("🔍 [GRAPHQL API] Handling OPTIONS preflight");
    const origin = request.headers.get("Origin");
    const allowedOrigin = origin || "*";
    
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  
  // Continue with existing POST handling...
  try {
    // Only handle POST requests for GraphQL queries
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      );
    }
    // ... rest of existing code
  }
}
```

### 2. CORS Headers Configuration

**Critical Headers Set**:
- `Access-Control-Allow-Origin`: Dynamic origin (e.g., `https://staging.jvs.org.uk`)
- `Access-Control-Allow-Methods`: `GET, POST, OPTIONS`
- `Access-Control-Allow-Headers`: `Content-Type, Authorization`
- `Access-Control-Allow-Credentials`: `true`
- `Access-Control-Max-Age`: `86400` (24 hours)

### 3. Dynamic Origin Handling

The solution uses **dynamic origin detection** instead of wildcard (`*`):
```javascript
const origin = request.headers.get("Origin");
const allowedOrigin = origin || "*";
```

This approach:
- ✅ Supports credentials (`Access-Control-Allow-Credentials: true`)
- ✅ Works with multiple origins (staging, production)
- ✅ More secure than wildcard CORS

## Deployment Process

### Files Modified
1. **`worker.js`** - Added OPTIONS handler to `handleGraphQLAPI` function

### Commands Used
```bash
# Navigate to staging directory
cd /Users/danjacobs/Software\ Projects/JVS/jvs-website-staging

# Create backup
cp worker.js worker.js.backup

# Insert OPTIONS handler using sed
sed -i '' '180i\
  console.log("🔍 [GRAPHQL API] Method:", request.method);\
  if (request.method === "OPTIONS") {\
    console.log("🔍 [GRAPHQL API] Handling OPTIONS preflight");\
    const origin = request.headers.get("Origin");\
    const allowedOrigin = origin || "*";\
    return new Response(null, {\
      status: 200,\
      headers: {\
        "Access-Control-Allow-Origin": allowedOrigin,\
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",\
        "Access-Control-Allow-Headers": "Content-Type, Authorization",\
        "Access-Control-Allow-Credentials": "true",\
        "Access-Control-Max-Age": "86400"\
      }\
    });\
  }\
' worker.js

# Deploy to staging
wrangler deploy --env staging
```

### Deployment Result
- **Worker Version**: `a2bd74db-5e74-4afc-895f-a731f7e8848a`
- **Size Change**: 107.82 KiB → 108.44 KiB (confirming code changes)
- **Status**: Successfully deployed to `https://jvs-website-staging.dan-794.workers.dev`

## Verification Tests

### 1. OPTIONS Preflight Request Test
```bash
curl -X OPTIONS -H "Origin: https://staging.jvs.org.uk" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v https://jvs-website-staging.dan-794.workers.dev/api/graphql
```

**Result**: ✅ HTTP 200 with correct CORS headers

### 2. POST GraphQL Request Test
```bash
curl -s -H "Origin: https://staging.jvs.org.uk" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ posts(first: 1) { nodes { id title } } }"}' \
  https://jvs-website-staging.dan-794.workers.dev/api/graphql
```

**Result**: ✅ Returns valid GraphQL data

### 3. Browser Test
**URL**: `https://staging.jvs.org.uk/checkout?eventId=12088&quantity=1`
**Result**: ✅ No CORS errors, checkout page loads successfully

## Worker Logs Confirmation

The following logs confirm the solution is working:
```
OPTIONS https://jvs-website-staging.dan-794.workers.dev/api/graphql - Ok
  (log) 🚀 [CUSTOM WORKER] Request URL: /api/graphql
  (log) 🔍 [CUSTOM WORKER] Handling GraphQL API
  (log) 🔍 [GRAPHQL API] Method: OPTIONS
  (log) 🔍 [GRAPHQL API] Handling OPTIONS preflight

POST https://jvs-website-staging.dan-794.workers.dev/api/graphql - Ok
  (log) 🚀 [CUSTOM WORKER] Request URL: /api/graphql
  (log) 🔍 [CUSTOM WORKER] Handling GraphQL API
  (log) 🔍 [GRAPHQL API] Method: POST
  (log) 🔍 [GRAPHQL API] Forwarding request to WordPress GraphQL
  (log) ✅ [GRAPHQL API] Successfully forwarded request
```

## Architecture Overview

```
Browser (staging.jvs.org.uk)
    ↓ OPTIONS preflight request
Cloudflare Worker (jvs-website-staging.dan-794.workers.dev)
    ↓ Returns 200 + CORS headers
Browser receives CORS approval
    ↓ POST GraphQL request
Cloudflare Worker
    ↓ Forwards to WordPress GraphQL
WordPress Backend (backend.jvs.org.uk/graphql)
    ↓ Returns GraphQL data
Cloudflare Worker
    ↓ Returns data + CORS headers
Browser (checkout page loads successfully)
```

## Environment Details

- **Staging Frontend**: `https://staging.jvs.org.uk`
- **Staging Worker**: `https://jvs-website-staging.dan-794.workers.dev`
- **WordPress GraphQL**: `https://backend.jvs.org.uk/graphql`
- **Wrangler Version**: 4.26.0
- **Node.js Environment**: Production

## Troubleshooting Guide

### If CORS Issues Return

1. **Check OPTIONS Handler**: Verify the OPTIONS handler is still present in `handleGraphQLAPI`
2. **Test OPTIONS Request**: Use curl to test preflight requests
3. **Check Worker Logs**: Use `wrangler tail --env staging --format pretty`
4. **Verify Deployment**: Ensure latest worker version is deployed

### Common Issues

1. **405 Method Not Allowed**: OPTIONS handler missing or not deployed
2. **Wildcard Origin with Credentials**: Cannot use `*` origin with `credentials: true`
3. **Missing Headers**: Ensure all required CORS headers are present

### Debug Commands

```bash
# Test OPTIONS preflight
curl -X OPTIONS -H "Origin: https://staging.jvs.org.uk" \
  -v https://jvs-website-staging.dan-794.workers.dev/api/graphql

# Monitor worker logs
wrangler tail --env staging --format pretty

# Check worker deployment
wrangler whoami
wrangler deployments list --env staging
```

## Related Files

- **Primary**: `jvs-website-staging/worker.js` (handleGraphQLAPI function)
- **Backup**: `jvs-website-staging/worker.js.backup`
- **Configuration**: `jvs-website-staging/wrangler.toml`

## Success Metrics

✅ **OPTIONS Request**: Returns HTTP 200 with proper CORS headers  
✅ **POST Request**: Returns valid GraphQL data  
✅ **Browser Test**: Checkout page loads without CORS errors  
✅ **Worker Logs**: Show successful OPTIONS and POST handling  
✅ **Dynamic Origin**: Correctly reflects request origin  
✅ **Credentials Support**: `Access-Control-Allow-Credentials: true`  

---

**Date**: August 6, 2025  
**Status**: ✅ RESOLVED  
**Worker Version**: a2bd74db-5e74-4afc-895f-a731f7e8848a  
**Tested By**: AI Assistant  
**Verified By**: User (checkout page working)

---

# CORS Solution Update - January 8, 2025

## New CORS Issues Encountered

After reverting from Sanity CMS integration back to the main branch, we encountered persistent CORS issues on the live domain `https://jvs.org.uk` while the worker domain `https://jvs-website.dan-794.workers.dev` worked correctly.

### Primary Issues Identified

#### 1. **Cache-Control Header Not Allowed**
```
Request header field cache-control is not allowed by Access-Control-Allow-Headers in preflight response.
```
- **Root Cause**: Apollo Client was sending `Cache-Control: no-cache` header, but worker's CORS configuration only allowed `Content-Type, Authorization`
- **Impact**: All GraphQL requests were blocked by CORS preflight failures

#### 2. **Persistent Edge Caching**
```
GraphQL Proxy URL: https://jvs-website.dan-794.workers.dev/api/graphql (old endpoint)
Stripe API returning origin: https://staging.jvs.org.uk (wrong origin)
```
- **Root Cause**: Cloudflare edge cache was serving old client-side JavaScript and cached OPTIONS responses
- **Impact**: Even after deploying fixes, live domain continued using old endpoints and wrong CORS headers

#### 3. **Incorrect Origin Fallback**
- **Root Cause**: `getCorsHeaders()` function defaulted to `staging.jvs.org.uk` instead of production domain
- **Impact**: Wrong `Access-Control-Allow-Origin` header returned for production requests

## Solutions Implemented

### 1. **Enhanced CORS Headers Configuration**

**File**: `worker.js`
**Function**: `getCorsHeaders(request)`

```javascript
// Helper function to generate CORS headers - Updated for Cache-Control support
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  // Allow the actual origin, or fallback to production domain
  const allowOrigin = origin || 'https://jvs.org.uk'; // Changed from staging.jvs.org.uk
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, User-Agent, Accept', // Added Cache-Control, User-Agent, Accept
    'Access-Control-Allow-Credentials': 'true'
  };
}
```

**Key Changes**:
- ✅ Added `Cache-Control` to allowed headers
- ✅ Added `User-Agent, Accept` for comprehensive browser compatibility  
- ✅ Changed fallback origin from `staging.jvs.org.uk` to `jvs.org.uk`

### 2. **Cache-Busting Strategy**

Created versioned endpoints to bypass persistent edge caching:

**New Endpoints**:
- `/api/graphql-v5` (instead of `/api/graphql`)
- `/api/stripe-config-v5` (instead of `/api/stripe-config`)

**Files Modified**:
- `src/lib/wpClient.ts`: Updated `proxyUrl` to use `/api/graphql-v5`
- `src/app/checkout/page.tsx`: Updated Stripe config fetch to `/api/stripe-config-v5`
- `worker.js`: Added routing for cache-busting endpoints

### 3. **Consistent CORS Implementation**

Ensured all API handlers use the centralized `getCorsHeaders()` function:

```javascript
// GraphQL API - Explicit CORS handling
if (request.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: {
      ...getCorsHeaders(request),
      'Access-Control-Max-Age': '0', // Don't cache preflight responses
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

// All API responses now use getCorsHeaders(request) instead of hardcoded values
```

## Deployment Process

### Files Modified
1. **`worker.js`** - Enhanced CORS headers and cache-busting endpoints
2. **`src/lib/wpClient.ts`** - Updated GraphQL proxy URL to cache-busting endpoint
3. **`src/app/checkout/page.tsx`** - Updated Stripe config endpoint

### Commands Used
```bash
# Update client-side code with cache-busting endpoints
npm run build:minimal

# Build for Cloudflare Workers
npx @cloudflare/next-on-pages

# Remove conflicting worker file
rm -rf .vercel/output/static/_worker.js

# Deploy with cache-busting endpoints
npx wrangler deploy --env production
```

### Deployment Results
- **Worker Version**: `8a46b65c-53e8-40c7-8c02-d565c388a701`
- **Status**: Successfully deployed with cache-busting endpoints
- **Verification**: All endpoints returning correct CORS headers

## Cache Management Tools Created

### 1. **Zone ID Helper** (`get-zone-id.js`)
```javascript
// Script to guide users through finding Cloudflare Zone ID
console.log('1. Go to https://dash.cloudflare.com');
console.log('2. Click on your "jvs.org.uk" domain');
console.log('3. In the right sidebar, look for the "API" section');
console.log('4. Copy the "Zone ID" value');
```

### 2. **Cache Purge Script** (`purge-cache.js`)
```javascript
// Complete cache purge solution using Cloudflare API
const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ purge_everything: true })
};

fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`, options)
```

### 3. **Verification Script** (`test-cache-busting.js`)
Playwright-based script to verify cache-busting endpoints work correctly in real browser environment.

## Verification Tests

### 1. **CORS Headers Test**
```bash
curl -s -H "Origin: https://jvs.org.uk" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Cache-Control" \
  -X OPTIONS "https://jvs-website.dan-794.workers.dev/api/graphql-v5" -I
```

**Result**: ✅ Returns correct CORS headers including `Cache-Control`

### 2. **Cache-Busting Endpoints Test**
```bash
curl -s -o /dev/null -w "%{http_code}" "https://jvs-website.dan-794.workers.dev/api/graphql-v5"
curl -s -o /dev/null -w "%{http_code}" "https://jvs-website.dan-794.workers.dev/api/stripe-config-v5"
```

**Result**: ✅ Both endpoints return expected HTTP status codes

### 3. **Browser Verification**
Using Playwright headless browser test:
- ✅ Frontend correctly uses cache-busting endpoints (`/api/graphql-v5`)
- ✅ CORS headers include `Cache-Control, User-Agent, Accept`
- ✅ Origin correctly set to `https://jvs.org.uk`
- ✅ No CORS preflight failures

## Architecture Flow (Updated)

```
Browser (jvs.org.uk)
    ↓ OPTIONS preflight with Cache-Control header
Cloudflare Worker (jvs-website.dan-794.workers.dev/api/graphql-v5)
    ↓ Returns 204 + Enhanced CORS headers (includes Cache-Control)
Browser receives CORS approval
    ↓ POST GraphQL request with Cache-Control: no-cache
Cloudflare Worker
    ↓ Forwards to WordPress GraphQL
WordPress Backend (backend.jvs.org.uk/graphql)
    ↓ Returns GraphQL data
Cloudflare Worker
    ↓ Returns data + Enhanced CORS headers
Browser (checkout page loads successfully)
```

## Troubleshooting Guide (Updated)

### For Persistent Cache Issues

1. **Use Cache-Busting Endpoints**: Always increment version numbers for new deployments
2. **Purge Cloudflare Cache**: Use `purge-cache.js` script with Zone ID and API token
3. **Verify Client Updates**: Check browser console for endpoint URLs being used
4. **Test with Headless Browser**: Use `test-cache-busting.js` for accurate results

### Debug Commands (Updated)

```bash
# Test cache-busting CORS headers
curl -X OPTIONS -H "Origin: https://jvs.org.uk" \
  -H "Access-Control-Request-Headers: Content-Type,Cache-Control" \
  -v https://jvs-website.dan-794.workers.dev/api/graphql-v5

# Verify cache-busting endpoints
node test-cache-busting.js

# Check deployment status
npx wrangler deployments list --env production

# Monitor worker logs (if accessible)
npx wrangler tail --env production --format pretty
```

## Success Metrics (Updated)

✅ **Enhanced CORS Headers**: Includes `Cache-Control, User-Agent, Accept`  
✅ **Cache-Busting Endpoints**: `/api/graphql-v5`, `/api/stripe-config-v5` working  
✅ **Correct Origin Handling**: `https://jvs.org.uk` instead of staging  
✅ **Browser Verification**: Headless test confirms no CORS errors  
✅ **Client Updates**: Frontend uses cache-busting endpoints  
✅ **Cache Management**: Tools created for future cache issues  

---

**Date**: January 8, 2025  
**Status**: ✅ RESOLVED (Cache-Busting Strategy)  
**Worker Version**: 8a46b65c-53e8-40c7-8c02-d565c388a701  
**Tested By**: AI Assistant  
**Cache Issue**: Persistent edge caching resolved with versioned endpoints  
**GitHub Commit**: 50c51e0 (CORS fix) + f694d21 (test scripts)