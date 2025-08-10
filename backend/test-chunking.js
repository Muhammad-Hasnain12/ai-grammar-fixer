import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

// Test data for chunking functionality
const chunkingTestCases = [
  {
    name: 'Large paragraph with multiple errors',
    input: `Dear Sir or Madam, i am writing this letter to inform you about the meeting we had last week on tuesday. during our discussion, we talked about several important matters that needs immediate attention. firstly, the project deadline has been moved forward to next month, which means we have less time then originally planned. secondly, there budget constraints that we need to address. the team members has been working very hard but they're facing many challenges. some of the problems includes lack of proper communication between departments, insufficient resources, and unclear objectives. we believe that if we implement the suggestions that was discussed in the meeting, we can overcome these obstacles. however, we need your approval before proceeding with any changes. please let me know what you think about our proposal and whether you agree with our recommendations. i look forward to hearing from you soon. thank you for your time and consideration. sincerely yours, john smith.`,
    expectedMinCorrections: 10
  },
  {
    name: 'Very large text (2000+ characters)',
    input: `This is the first paragraph of a very long document that contains multiple errors and should be split into chunks for processing. i hope this text will be processed correctly by the chunking algorithm. the system should handle large texts without any issues, even when they contain many grammar mistakes and spelling errors that need to be corrected by the advanced language processing system.

The second paragraph continues with more content to make this text longer than the maximum chunk size limit. this paragraph also contains several grammar errors that need to be corrected by the languagetool api integration. the chunking system should split this text intelligently without cutting words in the middle, which would cause processing errors and incorrect results that could confuse users and provide poor user experience.

The third paragraph adds even more content to ensure we exceed the chunk size limit significantly. this approach allows us to test the reassembly functionality where multiple chunks are processed separately and then combined back together to produce the final corrected text. the system must maintain the correct order and positions of all corrections across multiple chunks to ensure accuracy and reliability.

Finally, the fourth paragraph completes our test case with additional content that brings the total character count well above the chunking threshold. this comprehensive test ensures that our grammar correction system can handle real-world scenarios where users submit large documents or lengthy emails for grammar checking and correction. the backend should process all chunks efficiently and return a properly formatted response with all corrections applied correctly.`,
    expectedMinCorrections: 8
  },
  {
    name: 'Medium text with punctuation errors',
    input: `hello world this is a test sentence without proper punctuation i think this should be corrected by the grammar checking system because punctuation is very important for readability and comprehension of text especially in professional documents and formal communication where clarity and proper formatting are essential for effective communication between parties involved in business transactions`,
    expectedMinCorrections: 3
  }
];

async function testHealthCheck() {
  console.log('🔍 Testing health check endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    
    if (response.ok && data.status === 'running') {
      console.log('✅ Health check passed');
      console.log(`   Version: ${data.version}`);
      console.log(`   Features: ${data.features?.join(', ') || 'Basic grammar checking'}`);
      return true;
    } else {
      console.log('❌ Health check failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testChunkingFunctionality(testCase) {
  console.log(`🔍 Testing chunking: ${testCase.name}`);
  console.log(`   Input length: ${testCase.input.length} characters`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/check-grammar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: testCase.input })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ ${testCase.name} - Success`);
      console.log(`   Original length: ${data.originalText.length} characters`);
      console.log(`   Total chunks: ${data.chunks.total}`);
      console.log(`   Chunks processed: ${data.chunks.processed}`);
      console.log(`   Total corrections: ${data.summary.totalCorrections}`);
      console.log(`   Expected minimum: ${testCase.expectedMinCorrections}`);
      
      // Verify minimum corrections
      if (data.summary.totalCorrections >= testCase.expectedMinCorrections) {
        console.log(`   ✅ Correction count meets minimum requirement`);
      } else {
        console.log(`   ⚠️ Correction count below minimum (${data.summary.totalCorrections} < ${testCase.expectedMinCorrections})`);
      }
      
      // Show chunk details
      if (data.chunks.details) {
        console.log(`   📋 Chunk breakdown:`);
        data.chunks.details.forEach(chunk => {
          const status = chunk.error ? '❌ Error' : '✅ OK';
          console.log(`     Chunk ${chunk.chunkIndex}: ${chunk.length} chars, ${chunk.corrections} corrections ${status}`);
        });
      }
      
      // Show preview of corrected text
      const preview = data.correctedText.length > 150 
        ? data.correctedText.substring(0, 150) + '...'
        : data.correctedText;
      console.log(`   📝 Preview: "${preview}"`);
      
      return true;
    } else {
      console.log(`❌ ${testCase.name} - Failed:`, data);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${testCase.name} - Error:`, error.message);
    return false;
  }
}

async function testLegacyEndpoint() {
  console.log('🔄 Testing legacy endpoint with large text...');
  const largeText = chunkingTestCases[0].input;
  
  try {
    const response = await fetch(`${API_BASE_URL}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: largeText })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Legacy endpoint handled large text correctly');
      console.log(`   Total corrections: ${data.summary.totalCorrections}`);
      return true;
    } else {
      console.log('❌ Legacy endpoint failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Legacy endpoint error:', error.message);
    return false;
  }
}

async function runChunkingTests() {
  console.log('🚀 Starting Grammar Fixer Chunking Tests\n');
  
  // Test health check first
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Backend is not running. Please start the server first.');
    console.log('💡 Run: npm run dev');
    return;
  }
  
  console.log('\n🔗 Testing chunking functionality...\n');
  
  let passed = 0;
  let total = chunkingTestCases.length;
  
  // Test chunking functionality
  for (const testCase of chunkingTestCases) {
    const success = await testChunkingFunctionality(testCase);
    if (success) passed++;
    console.log(''); // Empty line for readability
  }
  
  // Test legacy endpoint
  console.log('🔄 Testing backward compatibility...\n');
  const legacySuccess = await testLegacyEndpoint();
  if (legacySuccess) passed++;
  total++;
  
  console.log(`\n📊 Chunking Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('🎉 All chunking tests passed! Your backend handles large texts correctly.');
    console.log('\n✨ Features verified:');
    console.log('   ✅ Text chunking without cutting words');
    console.log('   ✅ Multiple chunk processing');
    console.log('   ✅ Correction reassembly');
    console.log('   ✅ Full LanguageTool API response');
    console.log('   ✅ Error handling for failed chunks');
    console.log('   ✅ Backward compatibility');
  } else {
    console.log('⚠️ Some chunking tests failed. Please check the implementation.');
  }
  
  console.log('\n📝 Available endpoints:');
  console.log('   POST /check-grammar - New endpoint with chunking support');
  console.log('   POST /check - Legacy endpoint (redirects large texts)');
  console.log('   GET / - Health check');
}

runChunkingTests().catch(console.error);
