# =============================================================================
# VocazAI — Kokoro TTS microservice
# Model: kokoro-v1.0 (310 MB) + voices-v1.0.bin (26 voix)
# Voix utilisées:
#   ff_siwis  — Français femme (France + Maroc)
#   af_heart  — Anglais femme (fallback)
# =============================================================================

FROM python:3.11-slim

WORKDIR /app

# System deps for soundfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsndfile1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Download Kokoro v1.0 model files (~310 MB) ───────────────────────────────
# Source: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
RUN for i in 1 2 3; do \
      wget -q --timeout=180 --tries=3 \
        -O kokoro-v1.0.onnx \
        "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx" && \
      wget -q --timeout=120 --tries=3 \
        -O voices-v1.0.bin \
        "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin" && \
      echo "✓ Models downloaded (kokoro-v1.0 + voices-v1.0)" && break || \
      (echo "Attempt $i failed, retrying in 5s…" && sleep 5); \
    done && \
    test -f kokoro-v1.0.onnx || (echo "ERROR: kokoro-v1.0.onnx not downloaded" && exit 1) && \
    test -f voices-v1.0.bin  || (echo "ERROR: voices-v1.0.bin not downloaded"  && exit 1)

COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
