#!/usr/bin/env node

/**
 * A/B Test Deployment Verification Script
 * 
 * This script tests both deployment modes to verify they're working correctly.
 */

const https = require('https');

const PRODUCTION_URL = 'https://jvs-website.dan-794.workers.dev';
const STATIC_URL = 'https://jvs-website-static.dan-794.workers.dev';

async function makeRequest(url, path) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${url}${path}`;
    
    https.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data.substring(0, 200) + '...' // Truncate for readability
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testDeployment() {
  console.log('🧪 [A/B TEST] Testing deployment modes...\n');
  
  const testPaths = [
    '/',
    '/events/',
    '/events/12088.html',
    '/events/12088/',
    '/events/12088/tickets.html',
    '/events/12088/tickets/'
  ];
  
  for (const path of testPaths) {
    console.log(`📋 Testing: ${path}`);
    
    try {
      // Test production (Pages adapter)
      const productionResult = await makeRequest(PRODUCTION_URL, path);
      console.log(`  🔵 Production: ${productionResult.statusCode} ${productionResult.headers['x-deployment-mode'] || 'N/A'}`);
      
      // Test static (Static export)
      const staticResult = await makeRequest(STATIC_URL, path);
      console.log(`  🟢 Static: ${staticResult.statusCode} ${staticResult.headers['x-deployment-mode'] || 'N/A'}`);
      
      // Compare results
      if (productionResult.statusCode === staticResult.statusCode) {
        console.log(`  ✅ Same status code: ${productionResult.statusCode}`);
      } else {
        console.log(`  ⚠️ Different status codes: ${productionResult.statusCode} vs ${staticResult.statusCode}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error testing ${path}: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🎯 [A/B TEST] Summary:');
  console.log('  - Production URL:', PRODUCTION_URL);
  console.log('  - Static URL:', STATIC_URL);
  console.log('  - Both deployments should be accessible');
  console.log('  - Check headers for X-Deployment-Mode to verify routing');
}

testDeployment().catch(console.error); 