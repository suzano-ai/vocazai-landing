# =============================================================================
# VocazAI — Faster-Whisper STT microservice
# Model : whisper-small (multilingual, ~244 MB) — 3× more accurate than base
# Internal only — never exposed to the internet
# =============================================================================

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download Whisper small model at build time (~244 MB)
# Avoids cold-start delay on first request
RUN python3 -c "\
from faster_whisper import WhisperModel; \
print('Downloading whisper-small model (~244 MB)…'); \
m = WhisperModel('small', device='cpu', compute_type='int8', download_root='/app/models'); \
print('✓ whisper-small ready'); \
"

COPY main.py .

EXPOSE 9000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000", "--workers", "1"]
