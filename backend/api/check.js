import fetch from 'node-fetch';

// Configuration
const MAX_CHUNK_SIZE = 1000; // Maximum characters per chunk
const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';

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

    res.status(200).json(response);

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({
      error: 'Grammar check failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
