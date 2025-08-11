import fetch from 'node-fetch';

// Configuration
const MAX_CHUNK_SIZE = 1000; // Maximum characters per chunk
const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';

// Helper function to check grammar for a single chunk
async function checkGrammarChunk(chunkText) {
  const formData = new URLSearchParams();
  formData.append('text', chunkText);
  formData.append('language', 'en-US');
  formData.append('enabledOnly', 'false');

  const response = await fetch(LANGUAGETOOL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'GrammarFixer/1.0.0'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    throw new Error(`LanguageTool API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST method is supported'
    });
  }

  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text field is required and must be a string'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text cannot be empty'
      });
    }

    // Check text length limits
    if (text.length > 50000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Text cannot exceed 50,000 characters. Please split into smaller sections.'
      });
    }

    // For small texts, use direct API call
    if (text.length <= MAX_CHUNK_SIZE) {
      const result = await checkGrammarChunk(text);
      
      // Apply corrections
      let correctedText = text;
      const corrections = result.matches || [];
      
      for (let i = corrections.length - 1; i >= 0; i--) {
        const match = corrections[i];
        if (match.replacements && match.replacements.length > 0) {
          const replacement = match.replacements[0].value;
          const offset = match.offset;
          const length = match.length;
          
          correctedText = correctedText.slice(0, offset) + 
                         replacement + 
                         correctedText.slice(offset + length);
        }
      }

      res.json({
        success: true,
        originalText: text,
        correctedText: correctedText,
        corrections: corrections,
        summary: {
          totalCorrections: corrections.length,
          hasCorrections: corrections.length > 0
        }
      });
    } else {
      // For large texts, redirect to chunking endpoint
      return res.redirect(307, '/check-grammar');
    }

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({
      error: 'Grammar check failed',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    });
  }
}
