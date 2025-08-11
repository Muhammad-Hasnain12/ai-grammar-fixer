# 🤖 AI Grammar Fixer

A powerful, modern web application that uses LanguageTool AI to correct grammar errors in real-time. Built with React, Node.js, and LanguageTool API for accurate grammar checking.

![AI Grammar Fixer](https://img.shields.io/badge/AI-Grammar%20Fixer-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production%20Ready-success?style=for-the-badge)

## ✨ Features

- 🎯 **Real-time Grammar Correction** - Instant AI-powered text improvement using LanguageTool
- 🎨 **Beautiful Modern UI** - Glass-morphism design with dark/light themes
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🚀 **Fast Performance** - Sub-second response times with smart text chunking
- 🔒 **Privacy-Focused** - Your text stays secure, no data persistence
- 📊 **Visual Diff** - See exactly what was changed with word-level highlighting
- 📋 **Copy Functionality** - Easy text copying with toast notifications
- 🌟 **Quick Examples** - Sample texts for different writing styles
- 📝 **Large Text Support** - Handles unlimited text length with intelligent chunking

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Tailwind CSS** - Utility-first styling with custom animations
- **Vite** - Fast build tool and development server
- **Custom Animations** - Smooth transitions and glass-morphism effects

### Backend (Node.js)
- **Express.js** - Web framework with CORS support
- **LanguageTool API** - Professional grammar checking service
- **Smart Text Chunking** - Handles large texts efficiently
- **Vercel Serverless** - Scalable deployment with 30s timeout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/Muhammad-Hasnain12/Grammer_AI.git
cd Grammer_AI
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your API URL (default: http://localhost:3001)
npm run dev
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```

The backend will start on port 3001 by default.

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL` pointing to your backend

### Backend (Vercel)
1. Deploy the `backend` folder to Vercel
2. Vercel automatically detects the serverless functions in `/api`
3. Set environment variables in Vercel dashboard if needed

## 📁 Project Structure

```
Grammer_AI/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Editor.jsx   # Main text editor
│   │   │   ├── About.jsx    # About page
│   │   │   ├── Toast.jsx    # Notification system
│   │   │   └── PolicyModal.jsx # Legal information
│   │   ├── lib/             # Utility functions
│   │   │   └── diff.js      # Text difference algorithm
│   │   ├── App.jsx          # Main application
│   │   └── index.css        # Global styles with animations
│   ├── tailwind.config.js   # Tailwind configuration
│   └── vite.config.js       # Vite configuration
├── backend/                  # Node.js backend
│   ├── api/                 # Vercel serverless functions
│   │   ├── check-grammar.js # Main grammar checking endpoint
│   │   └── check.js         # Legacy endpoint
│   ├── index.js             # Express server (local development)
│   ├── dev-server.js        # Development server
│   ├── package.json         # Dependencies
│   └── vercel.json          # Vercel configuration
└── README.md                # This file
```

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001
```

#### Backend (optional)
```bash
PORT=3001
# LanguageTool API is used directly, no additional config needed
```

## 🔧 How It Works

### 1. Text Processing
- User submits text through the React frontend
- Backend receives text and processes it intelligently
- Large texts are automatically split into chunks (1000 chars max)
- Each chunk is sent to LanguageTool API for grammar checking

### 2. Grammar Correction
- LanguageTool API analyzes each chunk for errors
- Backend reassembles corrections with proper offset handling
- Frontend displays corrected text with visual diff highlighting
- Changes are shown with added/removed word indicators

### 3. Smart Chunking
- Preserves word boundaries and sentence structure
- Maintains context between chunks
- Handles edge cases for very long words
- Ensures accurate correction positioning

## 🎯 API Endpoints

### POST `/check-grammar`
Main endpoint for grammar checking with chunking support.

**Request:**
```json
{
  "text": "Your text to check for grammar errors"
}
```

**Response:**
```json
{
  "success": true,
  "originalText": "Original text",
  "correctedText": "Corrected text",
  "corrections": [...],
  "summary": {
    "totalCorrections": 5,
    "hasCorrections": true
  }
}
```

### POST `/check`
Legacy endpoint for backward compatibility.

## 🚀 Performance Features

- **Sub-second Response**: Fast processing for typical texts
- **Unlimited Text Length**: Smart chunking handles any size
- **Memory Efficient**: No data persistence, in-memory processing
- **Scalable**: Serverless architecture for automatic scaling
- **Optimized UI**: 60fps animations with GPU acceleration

## 🔒 Privacy & Security

- **No Data Storage**: Text is processed in-memory only
- **Secure API**: HTTPS-only communication
- **CORS Protection**: Controlled cross-origin access
- **Input Validation**: Sanitized text processing
- **Privacy Policy**: Clear data handling information

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LanguageTool](https://languagetool.org/) for the grammar checking API
- [Tailwind CSS](https://tailwindcss.com/) for the amazing styling framework
- [Vercel](https://vercel.com/) for the deployment platform

## 📧 Contact

**Muhammad Hasnain** - hasnainmemon02@outlook.com

- **GitHub**: [Muhammad-Hasnain12](https://github.com/Muhammad-Hasnain12)
- **LinkedIn**: [muhammad-hasnain](https://www.linkedin.com/in/muhammad-hasnain-61b4aa379/)
- **Portfolio**: [hasnainportfolio.vercel.app](https://hasnainportfolio.vercel.app)

## 🎯 Live Demo

Check out the live application: [https://grammar-fixer.vercel.app](https://grammar-fixer.vercel.app)

---

Made with ❤️ by Muhammad Hasnain