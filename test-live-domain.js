const { chromium } = require('playwright');

async function testLiveDomainCORS() {
  console.log('🧪 Testing CORS fix for live domain (jvs.org.uk)...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture network responses to check CORS headers
  const corsHeaders = [];
  
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      corsHeaders.push({
        url: response.url(),
        status: response.status(),
        origin: response.headers()['access-control-allow-origin'],
        headers: response.headers()['access-control-allow-headers'],
        methods: response.headers()['access-control-allow-methods']
      });
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
      console.log(`   CORS Origin: ${response.headers()['access-control-allow-origin']}`);
    }
  });
  
  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.toLowerCase().includes('cors') || 
        text.toLowerCase().includes('blocked') || 
        text.toLowerCase().includes('access to fetch')) {
      errors.push(text);
      console.log('🚨 CORS Error:', text);
    }
  });
  
  try {
    console.log('🔍 Testing live domain: https://jvs.org.uk/checkout...');
    await page.goto('https://jvs.org.uk/checkout?eventId=12088&quantity=1', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for JavaScript to execute
    await page.waitForTimeout(3000);
    
    // Check checkout functionality
    const hasLoadingText = await page.locator('text=Loading payment system').count() > 0;
    const hasEventTitle = await page.locator('text=Summer social').count() > 0;
    const hasPaymentForm = await page.locator('form').count() > 0;
    
    console.log('\n📊 Live Domain Test Results:');
    console.log('   Domain tested: https://jvs.org.uk/');
    console.log('   Has loading text:', hasLoadingText);
    console.log('   Has event title:', hasEventTitle);
    console.log('   Has payment form:', hasPaymentForm);
    console.log('   CORS errors found:', errors.length);
    
    if (corsHeaders.length > 0) {
      console.log('\n📋 CORS Headers from API responses:');
      corsHeaders.forEach((resp, index) => {
        console.log(`   Response ${index + 1}:`);
        console.log(`     URL: ${resp.url}`);
        console.log(`     Status: ${resp.status}`);
        console.log(`     Access-Control-Allow-Origin: ${resp.origin}`);
        console.log(`     Access-Control-Allow-Headers: ${resp.headers}`);
      });
    }
    
    if (errors.length === 0 && !hasLoadingText && (hasEventTitle || hasPaymentForm)) {
      console.log('\n✅ SUCCESS: Live domain (jvs.org.uk) CORS issue RESOLVED!');
      console.log('   Checkout page is now working correctly on the live domain.');
    } else if (errors.length > 0) {
      console.log('\n❌ FAILURE: CORS errors still present on live domain');
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else if (hasLoadingText) {
      console.log('\n⚠️ PARTIAL: No CORS errors but page still loading');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
}

testLiveDomainCORS().catch(console.error);