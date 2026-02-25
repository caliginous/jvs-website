const { chromium } = require('playwright');

async function testCORSAfterCacheClear() {
  console.log('🧪 Testing CORS after cache clearing attempts...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Capture all network activity
  const apiCalls = [];
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/')) {
      const corsOrigin = response.headers()['access-control-allow-origin'];
      const corsHeaders = response.headers()['access-control-allow-headers'];
      const corsCredentials = response.headers()['access-control-allow-credentials'];
      
      apiCalls.push({
        url: url,
        status: response.status(),
        corsOrigin: corsOrigin,
        corsHeaders: corsHeaders,
        corsCredentials: corsCredentials
      });
      
      console.log(`📡 API Response: ${response.status()} ${url}`);
      console.log(`   CORS Origin: ${corsOrigin}`);
      console.log(`   CORS Headers: ${corsHeaders}`);
      console.log(`   CORS Credentials: ${corsCredentials}`);
      console.log('');
    }
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  try {
    console.log('🔍 Navigating to live domain checkout page...');
    await page.goto('https://jvs.org.uk/checkout?eventId=12088&quantity=1', { 
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for checkout to load
    await page.waitForTimeout(5000);
    
    // Check checkout status
    const hasLoadingText = await page.locator('text="Loading payment system..."').count();
    const hasEventTitle = await page.locator('h1').first().textContent();
    const hasPaymentForm = await page.locator('form[name="payment-form"]').count();
    
    console.log('\n📊 Final Checkout Status:');
    console.log(`   Has loading text: ${hasLoadingText > 0}`);
    console.log(`   Has event title: ${!!hasEventTitle}`);
    console.log(`   Has payment form: ${hasPaymentForm > 0}`);
    
    // Analyze CORS results
    console.log('\n🔍 CORS Analysis:');
    const graphqlCalls = apiCalls.filter(call => call.url.includes('/api/graphql'));
    const stripeCalls = apiCalls.filter(call => call.url.includes('/api/stripe-config'));
    
    if (graphqlCalls.length > 0) {
      console.log('GraphQL API Calls:');
      graphqlCalls.forEach(call => {
        const hasCacheControl = call.corsHeaders && call.corsHeaders.includes('Cache-Control');
        const hasCorrectOrigin = call.corsOrigin === 'https://jvs.org.uk';
        console.log(`  - ${call.url}: Origin=${call.corsOrigin}, Cache-Control=${hasCacheControl ? '✅' : '❌'}, Correct Origin=${hasCorrectOrigin ? '✅' : '❌'}`);
      });
    }
    
    if (stripeCalls.length > 0) {
      console.log('Stripe API Calls:');
      stripeCalls.forEach(call => {
        const hasCorrectOrigin = call.corsOrigin === 'https://jvs.org.uk';
        console.log(`  - ${call.url}: Origin=${call.corsOrigin}, Correct Origin=${hasCorrectOrigin ? '✅' : '❌'}`);
      });
    }
    
    // Final verdict
    const corsIssues = apiCalls.filter(call => 
      call.corsOrigin !== 'https://jvs.org.uk' || 
      (call.url.includes('graphql') && (!call.corsHeaders || !call.corsHeaders.includes('Cache-Control')))
    );
    
    if (corsIssues.length === 0 && hasPaymentForm > 0 && hasLoadingText === 0) {
      console.log('\n✅ SUCCESS: All CORS issues resolved! Checkout working on live domain.');
    } else {
      console.log(`\n❌ ISSUES REMAIN: ${corsIssues.length} CORS problems detected or checkout not loading properly.`);
      console.log('   Cache clearing may still be needed, or there may be other issues.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCORSAfterCacheClear();