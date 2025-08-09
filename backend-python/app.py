import os
import unicodedata
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import httpx

USE_HF_INFERENCE_API = os.getenv('USE_HF_INFERENCE_API', 'false').lower() == 'true'
HF_INFERENCE_API_TOKEN = os.getenv('HF_INFERENCE_API_TOKEN', '')
HF_INFERENCE_API_URL = os.getenv('HF_INFERENCE_API_URL', '')
HF_DEFAULT_MODEL = os.getenv('HF_DEFAULT_MODEL', 'vennify/t5-base-grammar-correction')
GRAMMAR_MODEL_NAME = os.getenv('GRAMMAR_MODEL_NAME', 'vennify/t5-base-grammar-correction')
MAX_INPUT_CHARS = int(os.getenv('MAX_INPUT_CHARS', '8000'))
ENABLE_DIFF_EXPLANATIONS = os.getenv('ENABLE_DIFF_EXPLANATIONS', 'true').lower() == 'true'

app = FastAPI(title='Grammar Fixer API')

origins = os.getenv('CORS_ORIGINS', '*')
allow_origins = ["*"] if origins == '*' else [o.strip() for o in origins.split(',') if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CorrectRequest(BaseModel):
    text: str


class CorrectionItem(BaseModel):
    from_text: Optional[str] = None
    to_text: Optional[str] = None
    explanation: Optional[str] = None


class CorrectResponse(BaseModel):
    corrected_text: str
    corrections: Optional[List[CorrectionItem]] = None


def normalize_text(s: str) -> str:
    return unicodedata.normalize('NFC', (s or '').strip())


_pipeline = None
if not USE_HF_INFERENCE_API:
    try:
        from transformers import pipeline
        # Lazy-init on startup so warm requests are fast
        _pipeline = pipeline(
            'text2text-generation', model=GRAMMAR_MODEL_NAME, tokenizer=GRAMMAR_MODEL_NAME
        )
    except Exception as e:
        # Model failed to load; service can still run if using HF Inference API
        print(f"[WARN] Failed to load local transformers model: {e}")
        if not USE_HF_INFERENCE_API:
            # Keep running but will error on request if used
            pass


def word_diff(original: str, corrected: str) -> List[CorrectionItem]:
    if not ENABLE_DIFF_EXPLANATIONS:
        return []
    a = [w for w in original.strip().split()] if original else []
    b = [w for w in corrected.strip().split()] if corrected else []
    # LCS
    dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]
    for i in range(len(a)-1, -1, -1):
        for j in range(len(b)-1, -1, -1):
            dp[i][j] = 1 + dp[i+1][j+1] if a[i] == b[j] else max(dp[i+1][j], dp[i][j+1])
    i=j=0
    items: List[CorrectionItem] = []
    while i < len(a) and j < len(b):
        if a[i] == b[j]:
            i+=1; j+=1
        elif dp[i+1][j] >= dp[i][j+1]:
            items.append(CorrectionItem(from_text=a[i], to_text=None, explanation=f"Removed '{a[i]}'"))
            i+=1
        else:
            items.append(CorrectionItem(from_text=None, to_text=b[j], explanation=f"Added '{b[j]}'"))
            j+=1
    while i < len(a):
        items.append(CorrectionItem(from_text=a[i], to_text=None, explanation=f"Removed '{a[i]}'"))
        i+=1
    while j < len(b):
        items.append(CorrectionItem(from_text=None, to_text=b[j], explanation=f"Added '{b[j]}'"))
        j+=1
    return items


async def generate_with_hf_inference(text: str) -> str:
    model_url = HF_INFERENCE_API_URL or f"https://api-inference.huggingface.co/models/{HF_DEFAULT_MODEL}"
    headers = {"Content-Type": "application/json"}
    if HF_INFERENCE_API_TOKEN:
        headers["Authorization"] = f"Bearer {HF_INFERENCE_API_TOKEN}"
    payload = {"inputs": text}
    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(model_url, headers=headers, json=payload)
        if r.status_code != 200:
            raise HTTPException(status_code=500, detail=f"HF Inference API error: {r.status_code}")
        data = r.json()
        if isinstance(data, list) and data:
            out = data[0].get('generated_text') or data[0].get('summary_text')
            return out or text
        if isinstance(data, dict) and 'generated_text' in data:
            return data['generated_text']
        return text


def generate_with_local(text: str) -> str:
    if _pipeline is None:
        raise HTTPException(status_code=500, detail="Local model not loaded. Set USE_HF_INFERENCE_API=true or fix model load.")
    # Some models expect prefix like 'gec: '
    prompt = text
    if 'vennify' in GRAMMAR_MODEL_NAME:
        prompt = f"gec: {text}"
    # Calculate appropriate lengths based on input
    input_length = len(prompt.split())
    max_output = min(2048, input_length * 2)  # Allow up to 2x input length
    min_output = max(input_length // 2, 50)   # At least half input length
    
    out = _pipeline(
        prompt, 
        max_new_tokens=min(512, input_length * 2),  # Use max_new_tokens instead of max_length
        min_length=min_output,
        num_beams=4, 
        do_sample=False, 
        early_stopping=False,
        no_repeat_ngram_size=3,
        length_penalty=1.0
    )
    return out[0]['generated_text']


@app.post('/correct', response_model=CorrectResponse)
async def correct(body: CorrectRequest):
    if not body.text or not isinstance(body.text, str):
        raise HTTPException(status_code=400, detail='Invalid input: provide non-empty text')
    text = normalize_text(body.text)[:MAX_INPUT_CHARS]
    if USE_HF_INFERENCE_API:
        corrected = await generate_with_hf_inference(text)
    else:
        corrected = generate_with_local(text)
    items = word_diff(text, corrected)
    return CorrectResponse(corrected_text=corrected, corrections=items)


@app.get('/health')
async def health():
    return {"ok": True}


