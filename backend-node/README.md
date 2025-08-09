## Node.js Middleware (Express)

Endpoints:
- POST `/api/correct` → forwards to FastAPI or Hugging Face Inference API

Local run:
```bash
cd backend-node
npm install
npm run dev
```

Environment (`env.example` → `.env`):
```
PORT=3001
PYTHON_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=*
USE_HF_INFERENCE_API=false
HF_INFERENCE_API_URL=
HF_INFERENCE_API_TOKEN=
HF_DEFAULT_MODEL=vennify/t5-base-grammar-correction
```

Vercel deploy:
```bash
vercel --prod
```

Notes:
- Enable a real rate limiter in production.
- When `USE_HF_INFERENCE_API=true`, this service calls the HF Inference API directly (recommended for Vercel-only setups).


