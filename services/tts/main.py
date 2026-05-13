"""
VocazAI — Piper TTS microservice
Model  : rhasspy/piper — ONNX neural TTS, real-time on CPU
Voices :
  fr_FR-siwis-medium  — French female  (Metropolitan French)
  en_US-jenny-medium  — English female (natural American English)
  ar_JO-kareem-medium — Arabic  male   (best available open-source Arabic voice)

All voices downloaded from HuggingFace at Docker build time.
Returns: audio/wav — no external API calls, 100% self-hosted.
"""

import io
import logging
import wave
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("tts")

app = FastAPI(title="VocazAI TTS (Piper)", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MODELS_DIR = Path("/app/models")

# voice-id → (onnx path, length_scale)
# length_scale > 1 = slower/clearer, < 1 = faster
VOICE_MAP: dict[str, tuple[str, float]] = {
    # Primary names used by demo-call-card
    "fr_FR-siwis-medium":  ("fr_FR-siwis-medium.onnx",  1.0),
    "en_US-hfc_female-medium": ("en_US-hfc_female-medium.onnx", 1.0),
    "ar_JO-kareem-medium": ("ar_JO-kareem-medium.onnx",  1.05),
    # Legacy Kokoro IDs → mapped to best Piper equivalent
    "ff_siwis":  ("fr_FR-siwis-medium.onnx",  1.0),
    "af_heart":  ("en_US-hfc_female-medium.onnx", 1.0),
    # edge-tts names → also supported
    "fr-FR-DeniseNeural": ("fr_FR-siwis-medium.onnx",      1.0),
    "en-US-JennyNeural":  ("en_US-hfc_female-medium.onnx",  1.0),
    "ar-MA-MounaNeural":  ("ar_JO-kareem-medium.onnx",  1.05),
}

DEFAULT_VOICE = "fr_FR-siwis-medium"

# Alias so old "jenny" references still resolve
VOICE_MAP["en_US-jenny-medium"] = ("en_US-hfc_female-medium.onnx", 1.0)

# Pre-loaded voice instances
_voices: dict[str, object] = {}


@app.on_event("startup")
def load_voices():
    try:
        from piper.voice import PiperVoice
    except ImportError:
        log.error("piper-tts not installed — run pip install piper-tts")
        return

    loaded_files: set[str] = set()
    for voice_id, (filename, _) in VOICE_MAP.items():
        if filename in loaded_files:
            continue
        onnx_path = MODELS_DIR / filename
        if not onnx_path.exists():
            log.warning(f"Model not found: {onnx_path}")
            continue
        try:
            log.info(f"Loading {filename}…")
            _voices[filename] = PiperVoice.load(str(onnx_path), use_cuda=False)
            loaded_files.add(filename)
            log.info(f"✓ {filename} ready")
        except Exception as e:
            log.error(f"Failed to load {filename}: {e}")

    log.info(f"Piper ready — {len(loaded_files)} voice(s) loaded")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "engine": "piper",
        "voices_loaded": list(_voices.keys()),
    }


@app.get("/voices")
def list_voices():
    return {"voices": list(VOICE_MAP.keys()), "engine": "piper"}


class TTSRequest(BaseModel):
    text:  str
    voice: str   = DEFAULT_VOICE
    speed: float = 0.92   # 0.92 → length_scale ~1.08 (slightly slower = clearer)
    lang:  str   = "fr-fr"  # kept for API compatibility


@app.post("/tts")
async def synthesize(req: TTSRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if len(text) > 800:
        raise HTTPException(status_code=400, detail="text too long (max 800 chars)")

    voice_key = VOICE_MAP.get(req.voice)
    if voice_key is None:
        voice_key = VOICE_MAP[DEFAULT_VOICE]
    filename, base_length_scale = voice_key

    voice = _voices.get(filename)
    if voice is None:
        raise HTTPException(status_code=503, detail=f"Voice model not loaded: {filename}")

    # speed 0.92 → length_scale ≈ 1.09 (invert: slower = clearer pronunciation)
    length_scale = round(base_length_scale / max(req.speed, 0.5), 3)

    try:
        log.info(f"Synthesising [{filename}] length_scale={length_scale} ({len(text)} chars)")

        buf = io.BytesIO()
        with wave.open(buf, "wb") as wav_file:
            voice.synthesize(text, wav_file, length_scale=length_scale)
        buf.seek(0)
        audio_bytes = buf.read()

        log.info(f"✓ {len(audio_bytes) / 1024:.1f} KB WAV generated")
        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={"Cache-Control": "no-store"},
        )
    except Exception as e:
        log.error(f"TTS synthesis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
