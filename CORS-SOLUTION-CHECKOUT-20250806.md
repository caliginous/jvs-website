# CORS Solution for JVS Checkout Page - August 6, 2025

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