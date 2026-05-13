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
RUN wget -q -O kokoro-v0_19.onnx \
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx && \
    wget -q -O voices.bin \
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin && \
    echo "Models downloaded."

COPY main.py .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
