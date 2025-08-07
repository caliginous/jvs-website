# JVS Website GitHub Actions Deployment - January 6, 2025

## Overview

The JVS website now has a robust GitHub Actions deployment system with separate workflows for staging and production environments.

## Workflow Files

### 1. `rebuild-staging.yml` - Staging Deployment
- **Purpose**: Deploy to staging environment for testing
- **Triggers**: Manual dispatch, WordPress webhook (`wordpress_update_staging`)
- **Target**: `https://staging.jvs.org.uk`
- **Features**:
  - Complete clean rebuild (removes all cache)
  - Staging environment configuration
  - Automatic test suite execution
  - Safe for frequent deployments

### 2. `rebuild-production.yml` - Production Deployment  
- **Purpose**: Deploy to production environment
- **Triggers**: Manual dispatch only (no automatic webhooks)
- **Target**: `https://jvs.org.uk`
- **Features**:
  - Pre-deployment testing (optional)
  - Post-deployment verification
  - Manual approval required
  - Complete clean rebuild

### 3. `rebuild.yml` - Legacy Dispatcher
- **Purpose**: Backwards compatibility with existing webhooks
- **Function**: Redirects to appropriate staging/production workflow
- **Default**: Routes webhooks to staging

## Usage

### Manual Deployment

**Staging:**
```
GitHub → Actions → "Rebuild JVS Website - Staging" → Run workflow
```

**Production:**
```
GitHub → Actions → "Rebuild JVS Website - Production" → Run workflow
```

### Webhook Deployment

WordPress webhooks automatically trigger staging deployments:
- Webhook type: `wordpress_update_staging`
- Target: Staging environment only
- Automatic testing included

## Deployment Process

### Staging Workflow
1. ✅ Checkout code
2. ✅ Setup Node.js 20 with npm cache
3. ✅ Install dependencies
4. ✅ Clean build artifacts (`.vercel/output`, `.next`, caches)
5. ✅ Create staging environment file
6. ✅ Build Next.js (minimal clean build)
7. ✅ Build for Cloudflare Workers
8. ✅ Create assets ignore file
9. ✅ Deploy to staging
10. ✅ Run test suite
11. ✅ Notify completion

### Production Workflow
1. ✅ Checkout code
2. ✅ Setup Node.js 20 with npm cache
3. ✅ Install dependencies + test dependencies
4. ✅ Clean build artifacts
5. ✅ Build Next.js (clean minimal build)
6. ✅ Build for Cloudflare Workers
7. ✅ Create assets ignore file
8. ✅ **Run pre-deployment tests** (optional)
9. ✅ Deploy to production
10. ✅ **Run post-deployment verification**
11. ✅ Notify completion

## Environment Variables

### Required Secrets
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token for wrangler deployments

### Build Environment Variables
- `WP_GRAPHQL_URL`: `https://backend.jvs.org.uk/graphql`
- `BUILD_TIME_BACKEND_URL`: `https://backend.jvs.org.uk/graphql`
- `NODE_ENV`: `production`

## Key Improvements

### From Previous Version
- ✅ **Working directory**: Properly set to `./jvs-website`
- ✅ **Clean builds**: Removes all cache before building
- ✅ **Environment-specific**: Separate staging and production workflows
- ✅ **Test integration**: Automatic testing with our test suite
- ✅ **Error handling**: Better error messages and failure handling
- ✅ **Cache optimization**: Uses npm cache for faster builds

### Safety Features
- 🛡️ **Staging first**: All webhooks go to staging by default
- 🛡️ **Manual production**: Production requires manual trigger
- 🛡️ **Pre-deployment testing**: Optional tests before production deployment
- 🛡️ **Post-deployment verification**: Confirms deployment worked
- 🛡️ **Clean builds**: Ensures no cached artifacts cause issues

## Testing Integration

Both workflows integrate with our test suite:
- **Staging**: Tests run after deployment (non-blocking)
- **Production**: Tests can run before deployment (blocking)

Test results are logged but don't block staging deployments (for rapid iteration).
Production deployments can be configured to fail if tests fail.

## Webhook Configuration

For WordPress to trigger deployments, configure webhooks to send:

**Staging Webhook:**
```
POST https://api.github.com/repos/caliginous/jvs-website/dispatches
Content-Type: application/json
Authorization: token YOUR_GITHUB_TOKEN

{
  "event_type": "wordpress_update_staging"
}
```

## Monitoring

Each workflow provides detailed logging:
- Build progress with emojis and clear status
- Deployment URLs and timestamps
- User and reason tracking
- Test results and verification status

## Rollback Strategy

If a deployment fails:
1. **Staging**: Simply redeploy previous version
2. **Production**: Manual rollback via GitHub Actions history
3. **Emergency**: Direct wrangler deployment from local machine

This system provides a robust, tested, and safe deployment pipeline for the JVS website.