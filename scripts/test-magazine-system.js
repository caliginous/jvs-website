const axios = require('axios');

async function testMagazineSystem() {
  console.log('🧪 Testing JVS Magazine Archive System');
  console.log('=' .repeat(50));
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jvs-website.dan-794.workers.dev';
  const tests = [
    {
      name: 'Magazine List API',
      url: `${baseUrl}/api/list-magazines`,
      method: 'GET'
    },
    {
      name: 'Search API (test query)',
      url: `${baseUrl}/api/search-magazines?q=vegan`,
      method: 'GET'
    },
    {
      name: 'Magazine Detail API (test ID)',
      url: `${baseUrl}/api/magazine?id=the-jewish-vegetarian-issue-1`,
      method: 'GET'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`\n🔍 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 10000
      });
      
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   📊 Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      passed++;
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   📊 Status: ${error.response.status}`);
        console.log(`   📊 Data: ${JSON.stringify(error.response.data).substring(0, 100)}...`);
      }
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! The magazine archive system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above and verify your setup.');
  }
  
  // Test database connection
  console.log('\n🔍 Testing Database Connection...');
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx wrangler d1 execute jvs-magazine-db --command="SELECT COUNT(*) as count FROM magazine_issues" --remote', { encoding: 'utf8' });
    console.log('✅ Database connection successful');
    console.log(`📊 Magazine count: ${result}`);
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
  }
  
  // Test R2 bucket
  console.log('\n🔍 Testing R2 Bucket...');
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx wrangler r2 bucket list', { encoding: 'utf8' });
    if (result.includes('jvs-magazines')) {
      console.log('✅ R2 bucket "jvs-magazines" found');
    } else {
      console.log('❌ R2 bucket "jvs-magazines" not found');
    }
  } catch (error) {
    console.log('❌ R2 bucket test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testMagazineSystem().catch(console.error);
}

module.exports = { testMagazineSystem }; 