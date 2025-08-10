import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const MAX_CHUNK_SIZE = 1000; // Maximum characters per chunk
const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for large texts
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper function to split text into chunks without cutting words
function splitTextIntoChunks(text, maxChunkSize = MAX_CHUNK_SIZE) {
  if (text.length <= maxChunkSize) {
    return [{ text, offset: 0 }];
  }

  const chunks = [];
  let currentOffset = 0;
  
  while (currentOffset < text.length) {
    let chunkEnd = currentOffset + maxChunkSize;
    
    // If we're at the end of the text, take the rest
    if (chunkEnd >= text.length) {
      chunks.push({
        text: text.slice(currentOffset),
        offset: currentOffset
      });
      break;
    }
    
    // Find the last space or punctuation before the limit to avoid cutting words
    let lastSafeBreak = chunkEnd;
    for (let i = chunkEnd; i > currentOffset; i--) {
      const char = text[i];
      if (char === ' ' || char === '\n' || char === '\t' || 
          char === '.' || char === '!' || char === '?' || 
          char === ',' || char === ';' || char === ':') {
        lastSafeBreak = i + 1; // Include the punctuation/space
        break;
      }
    }
    
    // If no safe break found, use the original limit
    if (lastSafeBreak === chunkEnd && chunkEnd - currentOffset < 50) {
      lastSafeBreak = chunkEnd;
    }
    
    chunks.push({
      text: text.slice(currentOffset, lastSafeBreak),
      offset: currentOffset
    });
    
    currentOffset = lastSafeBreak;
  }
  
  return chunks;
}

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

// Helper function to reassemble corrected text from multiple chunks
function reassembleCorrectedText(originalText, chunksWithCorrections) {
  let correctedText = originalText;
  let totalOffset = 0;

  // Sort corrections by offset in descending order to apply from end to start
  const allCorrections = [];
  
  for (const chunk of chunksWithCorrections) {
    if (chunk.corrections && chunk.corrections.matches) {
      for (const match of chunk.corrections.matches) {
        if (match.replacements && match.replacements.length > 0) {
          allCorrections.push({
            offset: chunk.offset + match.offset,
            length: match.length,
            replacement: match.replacements[0].value,
            originalMatch: match
          });
        }
      }
    }
  }

  // Sort by offset descending to apply changes from end to start
  allCorrections.sort((a, b) => b.offset - a.offset);

  // Apply corrections
  for (const correction of allCorrections) {
    const start = correction.offset;
    const end = start + correction.length;
    
    correctedText = correctedText.slice(0, start) + 
                   correction.replacement + 
                   correctedText.slice(end);
  }

  return { correctedText, allCorrections };
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Grammar Fixer Backend API',
    status: 'running',
    version: '2.0.0',
    features: [
      'Large text chunking support',
      'LanguageTool API integration',
      'Vercel serverless compatible'
    ],
    endpoints: {
      'POST /check-grammar': 'Check and correct grammar with chunking support',
      'POST /check': 'Legacy endpoint for grammar checking'
    }
  });
});

// Main grammar checking endpoint with chunking support
app.post('/check-grammar', async (req, res) => {
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

    // Split text into chunks
    const chunks = splitTextIntoChunks(text);
    
    // Process each chunk
    const chunksWithCorrections = [];
    const allMatches = [];
    
    for (let i = 0; i < chunks.length; i++) {
      try {
        const chunkResult = await checkGrammarChunk(chunks[i].text);
        chunksWithCorrections.push({
          ...chunks[i],
          corrections: chunkResult,
          chunkIndex: i
        });
        
        // Adjust offsets for matches and add to all matches
        if (chunkResult.matches) {
          for (const match of chunkResult.matches) {
            allMatches.push({
              ...match,
              offset: match.offset + chunks[i].offset, // Adjust offset for global position
              chunkIndex: i
            });
          }
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i}:`, chunkError);
        // Continue with other chunks even if one fails
        chunksWithCorrections.push({
          ...chunks[i],
          corrections: null,
          error: chunkError.message,
          chunkIndex: i
        });
      }
    }

    // Reassemble corrected text
    const { correctedText, allCorrections } = reassembleCorrectedText(text, chunksWithCorrections);

    // Format response with full API data
    const response = {
      success: true,
      originalText: text,
      correctedText: correctedText,
      chunks: {
        total: chunks.length,
        processed: chunksWithCorrections.filter(c => c.corrections !== null).length,
        details: chunksWithCorrections.map(chunk => ({
          chunkIndex: chunk.chunkIndex,
          offset: chunk.offset,
          length: chunk.text.length,
          corrections: chunk.corrections ? chunk.corrections.matches.length : 0,
          error: chunk.error || null
        }))
      },
      corrections: allMatches,
      summary: {
        totalCorrections: allCorrections.length,
        hasCorrections: allCorrections.length > 0,
        chunksProcessed: chunksWithCorrections.filter(c => c.corrections !== null).length,
        totalChunks: chunks.length
      },
      // Include full LanguageTool response for advanced frontend processing
      languageToolResponse: {
        language: chunksWithCorrections[0]?.corrections?.language || null,
        software: chunksWithCorrections[0]?.corrections?.software || null,
        warnings: chunksWithCorrections[0]?.corrections?.warnings || null,
        matches: allMatches
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({
      error: 'Grammar check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Legacy endpoint for backward compatibility
app.post('/check', async (req, res) => {
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
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Endpoint not found'
  });
});

// Export for Vercel (serverless function)
export default app;

// For local development, uncomment these lines:
// app.listen(PORT, () => {
//   console.log(`🚀 Grammar Fixer Backend running on port ${PORT}`);
//   console.log(`📝 Health check: http://localhost:${PORT}/`);
//   console.log(`🔍 Grammar check: POST http://localhost:${PORT}/check`);
// });
