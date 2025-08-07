#!/usr/bin/env node

/**
 * Cloudflare Cache Purge Script for JVS Website
 * This script will purge the entire cache for the jvs.org.uk domain
 * to resolve persistent CORS issues caused by cached OPTIONS responses
 */

const https = require('https');

// Configuration
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || process.argv[2];
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.argv[3];

if (!ZONE_ID || !API_TOKEN) {
  console.error('❌ Missing required parameters');
  console.log('');
  console.log('Usage:');
  console.log('  node purge-cache.js <ZONE_ID> <API_TOKEN>');
  console.log('');
  console.log('Or set environment variables:');
  console.log('  export CLOUDFLARE_ZONE_ID="your-zone-id"');
  console.log('  export CLOUDFLARE_API_TOKEN="your-api-token"');
  console.log('  node purge-cache.js');
  console.log('');
  console.log('To get your Zone ID:');
  console.log('  1. Go to https://dash.cloudflare.com');
  console.log('  2. Click on "jvs.org.uk"');
  console.log('  3. Copy the Zone ID from the API section in the right sidebar');
  console.log('');
  console.log('To get your API Token:');
  console.log('  1. Go to https://dash.cloudflare.com/profile/api-tokens');
  console.log('  2. Click "Create Token"');
  console.log('  3. Use "Custom token" template');
  console.log('  4. Add permissions: Zone:Zone:Read, Cache:Cache:Purge');
  console.log('  5. Set Zone Resources to "Include: Specific zone: jvs.org.uk"');
  console.log('  6. Click "Continue to summary" and "Create Token"');
  process.exit(1);
}

console.log('🚀 Starting cache purge for jvs.org.uk...');
console.log(`📋 Zone ID: ${ZONE_ID}`);
console.log(`🔑 API Token: ${API_TOKEN.substring(0, 8)}...`);
console.log('');

const postData = JSON.stringify({
  purge_everything: true
});

const options = {
  hostname: 'api.cloudflare.com',
  port: 443,
  path: `/client/v4/zones/${ZONE_ID}/purge_cache`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('✅ Cache purge successful!');
        console.log(`📄 Purge ID: ${response.result.id}`);
        console.log('');
        console.log('🔄 Cache purge initiated. It may take a few minutes to propagate globally.');
        console.log('');
        console.log('📝 Next steps:');
        console.log('  1. Wait 2-3 minutes for cache to clear');
        console.log('  2. Test the live domain: https://jvs.org.uk/events/12088/tickets/');
        console.log('  3. Check browser console for CORS errors');
        console.log('  4. If issues persist, run the headless browser test');
        console.log('');
        console.log('🧪 To test with headless browser:');
        console.log('  node test-cors-final.js');
      } else {
        console.error('❌ Cache purge failed:');
        console.error(JSON.stringify(response.errors, null, 2));
        
        if (response.errors && response.errors.length > 0) {
          const error = response.errors[0];
          if (error.code === 6003) {
            console.log('');
            console.log('💡 This looks like an authentication error.');
            console.log('   Please check your API token permissions.');
          } else if (error.code === 1003) {
            console.log('');
            console.log('💡 This looks like an invalid Zone ID.');
            console.log('   Please verify your Zone ID from the Cloudflare dashboard.');
          }
        }
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();