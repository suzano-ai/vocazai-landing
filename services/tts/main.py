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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# ── Globals ───────────────────────────────────────────────────────────────────
_kokoro         = None
_available_voices: list[str] = []
_yasmine_voice  = "ff_siwis"   # will be resolved at startup

# French voice preference order — first one found in voices.bin wins
_FRENCH_VOICE_CANDIDATES = [
    "ff_siwis",   # SIWIS French female (preferred)
    "ff",
    "fr_female",
    "fr-fr_female",
]

# English fallback if no French voice is found
_ENGLISH_FALLBACK = "af_bella"


@app.on_event("startup")
def load_model():
    global _kokoro, _available_voices, _yasmine_voice
    log.info("Loading Kokoro ONNX model…")
    try:
        from kokoro_onnx import Kokoro
        _kokoro = Kokoro("kokoro-v0_19.onnx", "voices.bin")

        # List available voices
        try:
            voices = _kokoro.get_voices()
            _available_voices = list(voices) if voices else []
        except Exception:
            # Fallback: introspect the internal voices dict
            try:
                _available_voices = list(_kokoro.voices.keys())
            except Exception:
                _available_voices = []

        log.info(f"Available voices ({len(_available_voices)}): {sorted(_available_voices)}")

        # Pick best French voice
        for candidate in _FRENCH_VOICE_CANDIDATES:
            if candidate in _available_voices:
                _yasmine_voice = candidate
                log.info(f"Yasmine voice resolved → {_yasmine_voice}")
                break
        else:
            # Try prefix match: any voice starting with 'ff' or 'fr'
            french = [v for v in _available_voices if v.startswith(("ff", "fr"))]
            if french:
                _yasmine_voice = sorted(french)[0]
                log.info(f"Yasmine voice (prefix match) → {_yasmine_voice}")
            elif _available_voices:
                _yasmine_voice = _ENGLISH_FALLBACK if _ENGLISH_FALLBACK in _available_voices else _available_voices[0]
                log.warning(f"No French voice found — using fallback: {_yasmine_voice}")
            else:
                log.error("No voices found at all! Check voices.bin download.")

        log.info("Kokoro ready.")
    except Exception as e:
        log.error(f"Failed to load Kokoro: {e}")


class TTSRequest(BaseModel):
    text:  str
    voice: str   = "ff_siwis"   # will be overridden to resolved voice if not found
    speed: float = 1.0
    lang:  str   = "fr-fr"


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": _kokoro is not None,
        "yasmine_voice": _yasmine_voice,
        "voices_count": len(_available_voices),
    }


@app.get("/voices")
def list_voices():
    return {"voices": sorted(_available_voices), "yasmine": _yasmine_voice}


@app.post("/tts")
async def synthesize(req: TTSRequest):
    if _kokoro is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    if not req.text or len(req.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="text is required")

    if len(req.text) > 500:
        raise HTTPException(status_code=400, detail="text too long (max 500 chars)")

    # Resolve voice: if requested voice not available, use the resolved Yasmine voice
    voice = req.voice if req.voice in _available_voices else _yasmine_voice
    if voice != req.voice:
        log.info(f"Voice '{req.voice}' not available — using '{voice}'")

    try:
        log.info(f"Synthesising [{voice}] ({len(req.text)} chars)")
        samples, sample_rate = _kokoro.create(
            req.text.strip(),
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
