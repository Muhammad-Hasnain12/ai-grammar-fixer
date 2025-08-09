## Python Grammar Service (FastAPI)

Local run:
```bash
cd backend-python
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Environment (`env.example` → `.env`):
```
USE_HF_INFERENCE_API=false
HF_INFERENCE_API_TOKEN=
HF_INFERENCE_API_URL=
HF_DEFAULT_MODEL=vennify/t5-base-grammar-correction
GRAMMAR_MODEL_NAME=vennify/t5-base-grammar-correction
MAX_INPUT_CHARS=8000
CORS_ORIGINS=*
ENABLE_DIFF_EXPLANATIONS=true
```

Deploy notes:
- Vercel is not ideal for running transformers in serverless. Use Hugging Face Inference API or deploy to Render/Railway/VM.
- Alternative: Hugging Face Spaces (GPU or CPU) and point Node middleware to the public URL.

Docker:
```bash
docker build -t grammar-fixer-py ./backend-python
docker run -p 8000:8000 --env-file backend-python/env.example grammar-fixer-py
```


