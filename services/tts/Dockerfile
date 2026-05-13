# =============================================================================
# VocazAI — Piper TTS microservice
# rhasspy/piper — ONNX neural TTS, real-time on CPU, 100% self-hosted
#
# Voices (verified URLs from rhasspy/piper-voices):
#   fr_FR-siwis-medium  — French female        (v1.0.0)
#   en_US-hfc_female-medium — English female   (v1.0.0)
#   ar_JO-kareem-medium — Arabic male          (main branch)
# =============================================================================

FROM python:3.11-slim

WORKDIR /app

# espeak-ng is required by piper-tts for phonemization
RUN apt-get update && apt-get install -y --no-install-recommends \
    espeak-ng \
    espeak-ng-data \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Download Piper voice models from HuggingFace ─────────────────────────────
ARG HF_V1="https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0"
ARG HF_MAIN="https://huggingface.co/rhasspy/piper-voices/resolve/main"
RUN mkdir -p /app/models

# French female — fr_FR-siwis-medium (~63 MB, v1.0.0)
RUN wget -q --timeout=180 \
      "${HF_V1}/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx?download=true" \
      -O /app/models/fr_FR-siwis-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_V1}/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json?download=true" \
      -O /app/models/fr_FR-siwis-medium.onnx.json && \
    echo "✓ fr_FR-siwis-medium"

# English female — en_US-hfc_female-medium (~62 MB, v1.0.0)
RUN wget -q --timeout=180 \
      "${HF_V1}/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx?download=true" \
      -O /app/models/en_US-hfc_female-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_V1}/en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx.json?download=true" \
      -O /app/models/en_US-hfc_female-medium.onnx.json && \
    echo "✓ en_US-hfc_female-medium"

# Arabic — ar_JO-kareem-medium (main branch — not in v1.0.0)
RUN wget -q --timeout=180 \
      "${HF_MAIN}/ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx?download=true" \
      -O /app/models/ar_JO-kareem-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_MAIN}/ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx.json?download=true" \
      -O /app/models/ar_JO-kareem-medium.onnx.json && \
    echo "✓ ar_JO-kareem-medium"

COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
