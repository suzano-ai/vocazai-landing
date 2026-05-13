"""
VocazAI — Kokoro TTS microservice
Model : kokoro-v1.0.onnx + voices-v1.0.bin
Voice : ff_siwis  — native French female voice (Kokoro v1.0)
Lang  : fr-fr     — French phonemes
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import soundfile as sf
import io
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("tts")

app = FastAPI(title="VocazAI TTS", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Voice config ──────────────────────────────────────────────────────────────
# ff_siwis = native French female voice in Kokoro v1.0 (Swiss French phonemes,
#            cleanest French pronunciation available in the model)
VOICE_PRIMARY = "ff_siwis"

_kokoro = None


@app.on_event("startup")
def load_model():
    global _kokoro
    log.info("Loading Kokoro v1.0 ONNX model…")
    try:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
            log.info(f"✓ Kokoro ready — primary voice: {VOICE_PRIMARY}")
    except Exception as e:
        log.error(f"Failed to load Kokoro: {e}")


class TTSRequest(BaseModel):
    text:  str
    voice: str   = VOICE_PRIMARY
    speed: float = 0.92          # légèrement ralenti = meilleure diction
    lang:  str   = "fr-fr"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": _kokoro is not None,
        "voice": VOICE_PRIMARY,
    }


@app.get("/voices")
def list_voices():
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        voices = sorted(_kokoro.get_voices())
    except Exception:
        try:
            voices = sorted(_kokoro.voices.keys())
        except Exception:
            voices = [VOICE_PRIMARY]
    return {"voices": voices, "primary": VOICE_PRIMARY}


@app.post("/tts")
async def synthesize(req: TTSRequest):
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="text too long (max 500 chars)")

    # Allowlist — French voice first, others kept for flexibility
    allowed_voices = {
        "ff_siwis",                                          # French female (primary)
        "af_heart", "af_bella", "af_nova", "af_sarah",      # English fallbacks
        "af_sky", "af_jessica", "af_nicole", "af_alloy",
        "af_aoede", "af_kore", "af_river",
        "bf_emma", "bf_isabella", "bf_alice", "bf_lily",
    }
    voice = req.voice if req.voice in allowed_voices else VOICE_PRIMARY

    try:
        log.info(f"Synthesising [{voice}] lang={req.lang} speed={req.speed} ({len(text)} chars)")
        samples, sample_rate = _kokoro.create(
            text,
            voice=voice,
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
