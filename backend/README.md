# Grammar Fixer Backend

A Node.js + Express backend for a Grammar Fixer app that uses the free public LanguageTool API for grammar checking and correction with advanced text chunking support.

## 🚀 Features

- **Grammar Checking**: Uses LanguageTool API for accurate grammar correction
- **Large Text Support**: Intelligent chunking for texts over 1000 characters
- **Smart Text Splitting**: Chunks text without cutting words or sentences
- **Automatic Reassembly**: Combines corrections from multiple chunks seamlessly
- **Free API**: No API keys required - uses public LanguageTool service
- **CORS Enabled**: Frontend can call from any domain
- **Vercel Ready**: Deploy as serverless functions
- **Error Handling**: Comprehensive error handling and validation
- **Detailed Responses**: Returns corrected text and detailed correction information
- **Backward Compatibility**: Legacy endpoint support

## 📋 Requirements

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Health Check
- **GET** `/` - Health check and API information

**Response:**
```json
{
  "message": "Grammar Fixer Backend API",
  "status": "running",
  "version": "2.0.0",
  "features": [
    "Large text chunking support",
    "LanguageTool API integration",
    "Vercel serverless compatible"
  ],
  "endpoints": {
    "POST /check-grammar": "Check and correct grammar with chunking support",
    "POST /check": "Legacy endpoint for grammar checking"
  }
}
```

### Grammar Check with Chunking (Recommended)
- **POST** `/check-grammar` - Check and correct grammar with large text support

#### Request Body:
```json
{
  "text": "your text to check (can be very large)"
}
```

#### Response:
```json
{
  "success": true,
  "originalText": "your text to check",
  "correctedText": "your corrected text",
  "chunks": {
    "total": 3,
    "processed": 3,
    "details": [
      {
        "chunkIndex": 0,
        "offset": 0,
        "length": 1000,
        "corrections": 5,
        "error": null
      }
    ]
  },
  "corrections": [
    {
      "message": "The personal pronoun 'I' should be uppercase.",
      "shortMessage": "",
      "replacements": [{"value": "I"}],
      "offset": 0,
      "length": 1,
      "context": {"text": "i am going to the store", "offset": 0, "length": 23},
      "rule": {
        "id": "UPPERCASE_SENTENCE_START",
        "description": "Checks that a sentence starts with an uppercase letter",
        "category": "CASING"
      },
      "chunkIndex": 0
    }
  ],
  "summary": {
    "totalCorrections": 1,
    "hasCorrections": true,
    "chunksProcessed": 3,
    "totalChunks": 3
  },
  "languageToolResponse": {
    "language": {"name": "English", "code": "en-US"},
    "software": {"name": "LanguageTool", "version": "6.0"},
    "warnings": {},
    "matches": []
  }
}
```

### Legacy Grammar Check
- **POST** `/check` - Check and correct grammar (legacy endpoint)

*Note: For texts larger than 1000 characters, this endpoint automatically uses chunking.*

#### Request Body:
```json
{
  "text": "your text to check"
}
```

#### Response:
```json
{
  "success": true,
  "originalText": "your text to check",
  "correctedText": "your corrected text",
  "corrections": [
    {
      "message": "The personal pronoun 'I' should be uppercase.",
      "shortMessage": "",
      "replacements": [{"value": "I"}],
      "offset": 0,
      "length": 1,
      "context": {"text": "i am going to the store", "offset": 0, "length": 23},
      "rule": {
        "id": "UPPERCASE_SENTENCE_START",
        "description": "Checks that a sentence starts with an uppercase letter",
        "category": "CASING"
      }
    }
  ],
  "summary": {
    "totalCorrections": 1,
    "hasCorrections": true
  }
}
```

## 🔧 How Text Chunking Works

1. **Smart Splitting**: Text is split into chunks of maximum 1000 characters
2. **Word Boundary Detection**: Chunks are cut at word/sentence boundaries to avoid processing incomplete words
3. **Parallel Processing**: Each chunk is sent to LanguageTool API separately
4. **Offset Adjustment**: Correction positions are adjusted for the global text position
5. **Reassembly**: All corrections are merged and applied to the original text
6. **Error Resilience**: If one chunk fails, others continue processing

## 🧪 Testing

Run the basic tests:
```bash
npm test
```

Test chunking functionality:
```bash
node test-chunking.js
```

## ☁️ Vercel Deployment

### Quick Deploy

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Deploy automatically**

### Manual Deploy

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Project Structure for Vercel

```
backend/
├── api/
│   ├── check.js          # Legacy endpoint (serverless function)
│   └── check-grammar.js  # Main chunking endpoint (serverless function)
├── package.json
├── vercel.json
└── README.md
```

## 🔗 Frontend Integration

Update your frontend to use the new chunking endpoint:

```javascript
// For large texts, use the new endpoint
const response = await fetch(`${API_URL}/api/check-grammar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: userInput })
});

const data = await response.json();
console.log(`Processed ${data.chunks.total} chunks`);
console.log(`Applied ${data.summary.totalCorrections} corrections`);
```

## 📊 Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `MAX_CHUNK_SIZE` | 1000 | Maximum characters per chunk |
| `PORT` | 3001 | Development server port |
| `LANGUAGETOOL_API_URL` | https://api.languagetool.org/v2/check | LanguageTool API endpoint |

## 🐛 Error Handling

The API handles various error scenarios:

- **Invalid input**: Returns 400 with error message
- **Empty text**: Returns 400 with validation error
- **LanguageTool API errors**: Returns 500 with API error details
- **Chunk processing failures**: Continues with other chunks, reports errors in response
- **Network timeouts**: Returns 500 with timeout error

## 📝 Example Usage

**Small text (direct processing):**
```bash
curl -X POST http://localhost:3001/check \
  -H "Content-Type: application/json" \
  -d '{"text": "i am going to the store"}'
```

**Large text (chunked processing):**
```bash
curl -X POST http://localhost:3001/check-grammar \
  -H "Content-Type: application/json" \
  -d '{"text": "very long text here..."}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - feel free to use this in your projects!

---

**Ready for production!** 🚀 Deploy to Vercel and start processing large texts with confidence.