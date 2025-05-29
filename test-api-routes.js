#!/usr/bin/env node

/**
 * API Route Testing Script for EV-Trader Production
 * 
 * This script tests critical API endpoints to verify they're working correctly
 * after deployment. Run this after the build completes.
 */

const BASE_URL = 'https://ev-trader-fresh-start.windsurf.build';

const testEndpoints = [
  {
    name: 'Verification Status',
    url: '/api/verification/status',
    method: 'GET',
    expectedType: 'json',
    description: 'Tests user verification status endpoint'
  },
  {
    name: 'Vehicle Listings',
    url: '/api/vehicles',
    method: 'GET',
    expectedType: 'json',
    description: 'Tests vehicle listings endpoint'
  },
  {
    name: 'Debug Endpoint',
    url: '/api/debug',
    method: 'GET',
    expectedType: 'json',
    description: 'Tests general system health'
  },
  {
    name: 'Database Test',
    url: '/api/test-db',
    method: 'GET',
    expectedType: 'json',
    description: 'Tests database connectivity'
  }
];

async function testEndpoint(endpoint) {
  const fullUrl = `${BASE_URL}${endpoint.url}`;
  console.log(`\n🧪 Testing: ${endpoint.name}`);
  console.log(`   URL: ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl, {
      method: endpoint.method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EV-Trader-API-Test/1.0'
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    console.log(`   Content-Type: ${contentType}`);
    
    if (endpoint.expectedType === 'json' && contentType?.includes('application/json')) {
      const data = await response.json();
      console.log(`   ✅ SUCCESS: Valid JSON response`);
      console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
    } else if (endpoint.expectedType === 'json' && contentType?.includes('text/html')) {
      console.log(`   ❌ FAILED: Expected JSON but got HTML (likely 404 or routing issue)`);
      const text = await response.text();
      if (text.includes('404') || text.includes('This page could not be found')) {
        console.log(`   🔍 Diagnosis: API route not found - serverless function not working`);
      }
    } else {
      console.log(`   ⚠️  UNEXPECTED: Got content type ${contentType}`);
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 EV-Trader API Route Testing');
  console.log('================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Testing ${testEndpoints.length} endpoints...\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`Total endpoints tested: ${testEndpoints.length}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. If API routes return HTML instead of JSON:');
  console.log('   - Check Netlify function logs');
  console.log('   - Verify netlify.toml configuration');
  console.log('   - Ensure build completed successfully');
  console.log('\n2. If all tests pass:');
  console.log('   - Configure missing environment variables');
  console.log('   - Set up Clerk and Stripe webhooks');
  console.log('   - Test user registration flow');
  console.log('\n3. For debugging:');
  console.log('   - Check Netlify dashboard for build logs');
  console.log('   - Verify environment variables are set');
  console.log('   - Test individual API routes in browser');
}

// Run the tests
runTests().catch(console.error);
