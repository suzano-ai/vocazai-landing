"""
VocazAI — Kokoro TTS microservice
Runs inside Docker, internal to the vocazai_net network.
Exposed on port 8000. Never reachable from the public internet.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import soundfile as sf
import numpy as np
import io
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("tts")

app = FastAPI(title="VocazAI TTS", version="1.0.0")

# Allow requests from the Next.js container only (same Docker network)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Load Kokoro once at startup
_kokoro = None

@app.on_event("startup")
def load_model():
    global _kokoro
    log.info("Loading Kokoro ONNX model…")
    try:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro("kokoro-v0_19.onnx", "voices.bin")
        log.info("Kokoro ready.")
    except Exception as e:
        log.error(f"Failed to load Kokoro: {e}")


class TTSRequest(BaseModel):
    text: str
    voice: str = "ff_siwis"   # French female — Yasmine
    speed: float = 1.0
    lang: str = "fr-fr"


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": _kokoro is not None}


@app.post("/tts")
async def synthesize(req: TTSRequest):
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="text is required")

    if len(req.text) > 500:
        raise HTTPException(status_code=400, detail="text too long (max 500 chars)")

    try:
        log.info(f"Synthesising [{req.voice}] ({len(req.text)} chars)")
        samples, sample_rate = _kokoro.create(
            req.text.strip(),
            voice=req.voice,
            speed=req.speed,
            lang=req.lang,
        )
        buf = io.BytesIO()
        sf.write(buf, samples, sample_rate, format="WAV")
        buf.seek(0)
        return Response(
            content=buf.read(),
            media_type="audio/wav",
            headers={"Cache-Control": "no-store"},
        )
    except Exception as e:
        log.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
