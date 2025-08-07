#!/bin/bash

# JVS Test Suite Runner
# Usage: ./test-jvs.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}

echo "🧪 JVS Test Suite Runner"
echo "========================"

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Usage: ./test-jvs.sh [staging|production]"
    exit 1
fi

echo "🎯 Running tests against: $ENVIRONMENT"
echo ""

# Check if puppeteer is installed
if ! npm list puppeteer > /dev/null 2>&1; then
    echo "⚠️  Puppeteer not found. Installing..."
    npm install puppeteer
fi

# Run the test suite
node test-full-site.js "$ENVIRONMENT"