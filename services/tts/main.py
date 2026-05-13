"""
VocazAI — Kokoro TTS microservice
Model  : kokoro-v1.0.onnx + voices-v1.0.bin (26 voix)
Voices : ff_siwis (Français femme — France & Maroc)
         af_heart (Anglais femme — fallback)
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

app = FastAPI(title="VocazAI TTS", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Voix disponibles (kokoro-v1.0, 26 voix) ──────────────────────────────────
# Français femme   → ff_siwis           (France + Maroc)
# Anglais femme    → af_heart / af_bella / af_nova / af_sarah
# Anglais femme GB → bf_emma / bf_isabella
VOICE_FR = "ff_siwis"   # seule voix française femme disponible dans Kokoro
VOICE_EN = "af_heart"   # voix anglaise femme chaude et naturelle

_kokoro = None


@app.on_event("startup")
def load_model():
    global _kokoro
    log.info("Loading Kokoro v1.0 ONNX model…")
    try:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
        log.info(f"✓ Kokoro ready — French: {VOICE_FR}  English: {VOICE_EN}")
    except Exception as e:
        log.error(f"Failed to load Kokoro: {e}")


class TTSRequest(BaseModel):
    text:  str
    voice: str   = VOICE_FR   # ff_siwis par défaut (Yasmine)
    speed: float = 1.0
    lang:  str   = "fr-fr"    # fr-fr pour France + Maroc


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": _kokoro is not None,
        "voice_fr": VOICE_FR,
        "voice_en": VOICE_EN,
    }


@app.get("/voices")
def list_voices():
    """Liste toutes les voix disponibles dans voices-v1.0.bin"""
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        voices = sorted(_kokoro.get_voices())
    except Exception:
        try:
            voices = sorted(_kokoro.voices.keys())
        except Exception:
            voices = [VOICE_FR, VOICE_EN]
    return {"voices": voices, "yasmine": VOICE_FR, "english": VOICE_EN}


@app.post("/tts")
async def synthesize(req: TTSRequest):
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="text too long (max 500 chars)")

    # Sécurité : n'accepter que des voix féminines connues
    allowed = {VOICE_FR, VOICE_EN, "af_bella", "af_nova", "af_sarah",
               "af_sky", "bf_emma", "bf_isabella", "af_alloy"}
    voice = req.voice if req.voice in allowed else VOICE_FR

    try:
        log.info(f"Synthesising [{voice}] lang={req.lang} ({len(text)} chars)")
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
