#!/usr/bin/env node

/**
 * Test script for event revalidation
 * Usage: node scripts/test-revalidation.js [secret] [eventId]
 */

const https = require('https');

const BASE_URL = 'https://jvs-vercel.vercel.app';
const DEFAULT_SECRET = process.env.REVALIDATION_SECRET || 'test-secret';

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testRevalidation(secret = DEFAULT_SECRET, eventId = null) {
  console.log('🧪 Testing Event Revalidation System\n');
  
  try {
    // Test GET revalidation (all events)
    console.log('1️⃣ Testing GET revalidation (all events)...');
    const getUrl = eventId 
      ? `${BASE_URL}/api/revalidate-events?secret=${secret}&eventId=${eventId}`
      : `${BASE_URL}/api/revalidate-events?secret=${secret}`;
    
    const getResult = await makeRequest(getUrl);
    console.log(`   Status: ${getResult.status}`);
    console.log(`   Response: ${JSON.stringify(getResult.data, null, 2)}\n`);

    // Test POST revalidation (specific action)
    if (eventId) {
      console.log('2️⃣ Testing POST revalidation (event updated)...');
      const postUrl = `${BASE_URL}/api/revalidate-events`;
      const postData = {
        secret,
        action: 'event_updated',
        eventId: parseInt(eventId)
      };

      const postResult = await makeRequest(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
      
      console.log(`   Status: ${postResult.status}`);
      console.log(`   Response: ${JSON.stringify(postResult.data, null, 2)}\n`);
    }

    // Test invalid secret
    console.log('3️⃣ Testing invalid secret...');
    const invalidResult = await makeRequest(`${BASE_URL}/api/revalidate-events?secret=invalid`);
    console.log(`   Status: ${invalidResult.status}`);
    console.log(`   Response: ${JSON.stringify(invalidResult.data, null, 2)}\n`);

    console.log('✅ Revalidation tests completed!');
    
    if (getResult.status === 200) {
      console.log('🎉 Revalidation system is working correctly!');
    } else {
      console.log('❌ Revalidation system may have issues. Check the responses above.');
    }

  } catch (error) {
    console.error('❌ Error testing revalidation:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const secret = process.argv[2] || DEFAULT_SECRET;
const eventId = process.argv[3] || null;

if (!secret || secret === 'test-secret') {
  console.log('⚠️  Warning: Using default test secret. Set REVALIDATION_SECRET environment variable or pass as first argument.');
  console.log('   Usage: node scripts/test-revalidation.js [secret] [eventId]\n');
}

testRevalidation(secret, eventId);
