#!/usr/bin/env node

/**
 * Test script to verify cache-busting endpoints work correctly
 * This simulates what the live domain will do after cache clears
 */

const { chromium } = require('playwright');

async function testCacheBusting() {
  console.log('🧪 Testing Cache-Busting Endpoints...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    if (msg.text().includes('GraphQL Proxy URL') || msg.text().includes('Stripe')) {
      console.log('📱 [FRONTEND]', msg.text());
    }
  });
  
  // Listen for network requests
  page.on('request', request => {
    if (request.url().includes('api/graphql-v5') || request.url().includes('api/stripe-config-v5')) {
      console.log('🌐 [REQUEST]', request.method(), request.url());
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('api/graphql-v5') || response.url().includes('api/stripe-config-v5')) {
      console.log('📥 [RESPONSE]', response.status(), response.url());
      
      // Check CORS headers
      const corsHeaders = {
        'access-control-allow-origin': response.headers()['access-control-allow-origin'],
        'access-control-allow-headers': response.headers()['access-control-allow-headers'],
        'access-control-allow-credentials': response.headers()['access-control-allow-credentials']
      };
      console.log('🔒 [CORS]', JSON.stringify(corsHeaders, null, 2));
    }
  });
  
  try {
    console.log('🌍 Navigating to worker domain...');
    await page.goto('https://jvs-website.dan-794.workers.dev/checkout?eventId=12088&quantity=1', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    console.log('⏳ Waiting for API calls...');
    await page.waitForTimeout(5000);
    
    console.log('✅ Test completed - check logs above for cache-busting endpoints');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCacheBusting().catch(console.error);