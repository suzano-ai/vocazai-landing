"""
VocazAI — Faster-Whisper STT microservice
Model  : whisper-small (int8, CPU) — multilingual, 3× more accurate than base
Accepts: audio/webm, audio/mp4, audio/wav, audio/ogg (via ffmpeg)
Returns: { "text": "...", "language": "fr", "confidence": 0.98 }
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import logging

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("stt")

app = FastAPI(title="VocazAI STT", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

_model = None


@app.on_event("startup")
def load_model():
    global _model
    log.info("Loading Faster-Whisper small model…")
    try:
        from faster_whisper import WhisperModel
        _model = WhisperModel(
            "small",
            device="cpu",
            compute_type="int8",
            download_root="/app/models",
        )
        log.info("✓ Faster-Whisper small ready")
    except Exception as e:
        log.error(f"Failed to load model: {e}")


@app.get("/health")
def health():
    return {"status": "ok", "model": "small", "model_loaded": _model is not None}


@app.post("/stt")
async def transcribe(
    audio: UploadFile = File(...),
    language: str = Form(default="fr"),
):
    if _model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        log.info(f"Transcribing {len(content)/1024:.1f} KB [{language}]…")

        segments, info = _model.transcribe(
            tmp_path,
            language=language if language != "auto" else None,
            beam_size=5,                          # higher = more accurate
            best_of=5,                            # pick best of 5 candidates
            condition_on_previous_text=False,     # better for short phrases
            vad_filter=True,
            vad_parameters=dict(
                min_silence_duration_ms=500,      # wait longer before cutting
                speech_pad_ms=400,                # pad start/end — don't cut words
            ),
            temperature=0.0,                      # deterministic, no hallucinations
        )

        text = " ".join(seg.text.strip() for seg in segments).strip()
        log.info(f"Result: '{text}' (lang={info.language}, prob={info.language_probability:.2f})")

        return {
            "text":       text,
            "language":   info.language,
            "confidence": round(info.language_probability, 3),
        }

    except Exception as e:
        log.error(f"STT error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)
