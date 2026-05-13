# =============================================================================
# VocazAI — Kokoro TTS microservice
# Lightweight Python container. Internal only — not exposed to the internet.
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

# Download Kokoro ONNX model files at build time (~320 MB total)
# Retry up to 3 times in case of network blip
RUN for i in 1 2 3; do \
      wget -q --timeout=120 --tries=3 -O kokoro-v0_19.onnx \
        https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx && \
      wget -q --timeout=120 --tries=3 -O voices.bin \
        https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin && \
      echo "Models downloaded OK." && break || \
      (echo "Attempt $i failed, retrying…" && sleep 5); \
    done && \
    test -f kokoro-v0_19.onnx && test -f voices.bin || (echo "ERROR: model download failed" && exit 1)

COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
