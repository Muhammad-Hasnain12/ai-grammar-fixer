# 🤖 AI Grammar Fixer

A powerful, modern web application that uses artificial intelligence to correct grammar errors in real-time. Built with React, Node.js, Python FastAPI, and Hugging Face Transformers.

![AI Grammar Fixer](https://img.shields.io/badge/AI-Grammar%20Fixer-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Production%20Ready-success?style=for-the-badge)

## ✨ Features

- 🎯 **Real-time Grammar Correction** - Instant AI-powered text improvement
- 🎨 **Beautiful Modern UI** - Glass-morphism design with dark/light themes
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🚀 **Fast Performance** - Sub-second response times
- 🔒 **Privacy-Focused** - Your text stays secure
- 📊 **Visual Diff** - See exactly what was changed
- 📋 **Copy Functionality** - Easy text copying with toast notifications
- 🌟 **Quick Examples** - Sample texts for different writing styles

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Custom Animations** - Smooth transitions and effects

### Backend (Node.js)
- **Express.js** - Web framework
- **CORS** - Cross-origin support
- **Environment Variables** - Secure configuration

### AI Service (Python)
- **FastAPI** - High-performance Python API
- **Transformers** - Hugging Face AI models
- **PyTorch** - Machine learning framework
- **Uvicorn** - ASGI server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-grammar-fixer.git
cd ai-grammar-fixer
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
# Edit .env with your API URL
npm run dev
```

### 3. Node.js Backend Setup
```bash
cd backend-node
npm install
cp env.example .env
# Configure environment variables
npm run dev
```

### 4. Python AI Service Setup
```bash
cd backend-python
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp env.example .env
# Configure environment variables
uvicorn app:app --reload --port 8000
```

## 🌐 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Node.js Backend (Vercel)
1. Deploy the `backend-node` folder
2. Vercel automatically detects the serverless functions
3. Configure environment variables in Vercel dashboard

### Python Service (Railway/Render)
Since Vercel has limitations with Python/large models:
- Deploy to Railway, Render, or DigitalOcean
- Use Docker for containerization
- Set up Hugging Face Inference API as fallback

## 📁 Project Structure

```
ai-grammar-fixer/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend-node/            # Node.js middleware
│   ├── src/
│   ├── api/                # Vercel serverless functions
│   ├── package.json
│   └── vercel.json
├── backend-python/          # Python AI service
│   ├── app.py              # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
└── README.md
```

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

#### Node.js Backend (.env)
```
PORT=3001
PYTHON_SERVICE_URL=http://127.0.0.1:8000
USE_HF_INFERENCE_API=false
HF_INFERENCE_API_TOKEN=your_token_here
HF_DEFAULT_MODEL=vennify/t5-base-grammar-correction
CORS_ORIGIN=http://localhost:5173
```

#### Python Backend (.env)
```
USE_HF_INFERENCE_API=false
GRAMMAR_MODEL_NAME=vennify/t5-base-grammar-correction
MAX_INPUT_CHARS=8000
CORS_ORIGINS=*
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for the transformer models
- [Vennify](https://huggingface.co/vennify) for the grammar correction model
- [Tailwind CSS](https://tailwindcss.com/) for the amazing styling framework

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/ai-grammar-fixer](https://github.com/yourusername/ai-grammar-fixer)

## 🎯 Live Demo

Check out the live application: [https://ai-grammar-fixer.vercel.app](https://ai-grammar-fixer.vercel.app)

---

Made with ❤️ and AI