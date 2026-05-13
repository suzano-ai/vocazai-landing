# =============================================================================
# VocazAI — Piper TTS microservice
# rhasspy/piper — ONNX neural TTS, real-time on CPU, 100% self-hosted
#
# Voice models downloaded from HuggingFace at build time (~60 MB each):
#   fr_FR-siwis-medium  — French female
#   en_US-jenny-medium  — English female
#   ar_JO-kareem-medium — Arabic  male
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
# Each voice needs the .onnx model + .onnx.json config file
ARG HF_BASE="https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0"
RUN mkdir -p /app/models

# French female — fr_FR-siwis-medium (~63 MB)
RUN wget -q --timeout=120 \
      "${HF_BASE}/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx" \
      -O /app/models/fr_FR-siwis-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_BASE}/fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json" \
      -O /app/models/fr_FR-siwis-medium.onnx.json && \
    echo "✓ fr_FR-siwis-medium"

# English female — en_US-jenny-medium (~62 MB)
RUN wget -q --timeout=120 \
      "${HF_BASE}/en/en_US/jenny/medium/en_US-jenny-medium.onnx" \
      -O /app/models/en_US-jenny-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_BASE}/en/en_US/jenny/medium/en_US-jenny-medium.onnx.json" \
      -O /app/models/en_US-jenny-medium.onnx.json && \
    echo "✓ en_US-jenny-medium"

# Arabic — ar_JO-kareem-medium (~60 MB)
RUN wget -q --timeout=120 \
      "${HF_BASE}/ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx" \
      -O /app/models/ar_JO-kareem-medium.onnx && \
    wget -q --timeout=30 \
      "${HF_BASE}/ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx.json" \
      -O /app/models/ar_JO-kareem-medium.onnx.json && \
    echo "✓ ar_JO-kareem-medium"

COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
