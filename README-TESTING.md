# JVS Website Testing - January 6, 2025

## Default Test Suite

The JVS website now includes a comprehensive automated test suite for quality assurance.

### Quick Start

**Test Production:**
```bash
./test-jvs.sh production
```

**Test Staging:**
```bash
./test-jvs.sh staging
```

### Files

- `test-full-site.js` - Main test suite (Node.js + Puppeteer)
- `test-jvs.sh` - Bash wrapper script
- `JVS-TEST-SUITE-DOCUMENTATION-20250106.md` - Complete documentation

### Current Status

✅ **100% pass rate** on both staging and production environments

### What's Tested

- Events & tickets pages
- Checkout functionality & GraphQL
- Magazine pages
- Contact forms (Mailgun integration)
- Recipe & article pages
- Newsletter signup (Mailchimp)
- API health checks

This test suite should be run before any major deployments to ensure all functionality is working correctly.