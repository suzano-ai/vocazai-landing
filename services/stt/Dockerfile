# =============================================================================
# VocazAI — Faster-Whisper STT microservice
# Model : whisper-base (multilingual, 74 MB) — fast + accurate for French
# Internal only — never exposed to the internet
# =============================================================================

FROM python:3.11-slim

WORKDIR /app

# System deps: ffmpeg required for audio decoding
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download Whisper base model at build time (~74 MB)
# Avoids cold-start delay on first request
RUN python3 -c "\
from faster_whisper import WhisperModel; \
print('Downloading whisper-base model…'); \
m = WhisperModel('base', device='cpu', compute_type='int8', download_root='/app/models'); \
print('✓ Model ready'); \
"

COPY main.py .

EXPOSE 9000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000", "--workers", "1"]
