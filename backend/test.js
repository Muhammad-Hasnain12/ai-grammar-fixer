import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

async function testBackend() {
  console.log('🧪 Testing Grammar Fixer Backend...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.message);
    console.log('   Status:', healthData.status);
    console.log('   Version:', healthData.version);
    console.log('');

    // Test 2: Grammar check with simple error
    console.log('2️⃣ Testing grammar check...');
    const grammarResponse = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'i am going to the store'
      })
    });

    if (!grammarResponse.ok) {
      throw new Error(`Grammar check failed: ${grammarResponse.status}`);
    }

    const grammarData = await grammarResponse.json();
    console.log('✅ Grammar check passed!');
    console.log('   Original text:', grammarData.originalText);
    console.log('   Corrected text:', grammarData.correctedText);
    console.log('   Total corrections:', grammarData.summary.totalCorrections);
    
    if (grammarData.corrections.length > 0) {
      console.log('   First correction:', grammarData.corrections[0].message);
    }
    console.log('');

    // Test 3: Test with more complex text
    console.log('3️⃣ Testing complex grammar check...');
    const complexResponse = await fetch(`${BASE_URL}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'my friend and me go to park yesterday'
      })
    });

    if (!complexResponse.ok) {
      throw new Error(`Complex grammar check failed: ${complexResponse.status}`);
    }

    const complexData = await complexResponse.json();
    console.log('✅ Complex grammar check passed!');
    console.log('   Original text:', complexData.originalText);
    console.log('   Corrected text:', complexData.correctedText);
    console.log('   Total corrections:', complexData.summary.totalCorrections);
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');
    console.log('\n📝 You can now:');
    console.log('   - Use the backend locally at http://localhost:3001');
    console.log('   - Deploy to Vercel using the provided configuration');
    console.log('   - Integrate with your frontend using the /check endpoint');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('   npm start');
    process.exit(1);
  }
}

// Run tests
testBackend();
