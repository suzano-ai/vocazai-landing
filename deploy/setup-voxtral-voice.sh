#!/usr/bin/env bash
# =============================================================================
# VocazAI — One-time Voxtral voice setup
# Génère un sample audio depuis Kokoro (via Docker exec),
# crée une voix Yasmine chez Mistral, et sauvegarde le MISTRAL_VOICE_ID
#
# Usage: bash /var/www/vocazai-landing/deploy/setup-voxtral-voice.sh
# =============================================================================

set -e

ENV_FILE="/var/www/vocazai-landing/.env.local"
API_KEY="${MISTRAL_API_KEY:-$(grep '^MISTRAL_API_KEY=' "$ENV_FILE" 2>/dev/null | cut -d= -f2-)}"
APP_PORT=$(grep '^APP_PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2-); APP_PORT="${APP_PORT:-3000}"

R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m' C='\033[0;36m' BOLD='\033[1m' NC='\033[0m'

echo ""
echo -e "${BOLD}${C}  VocazAI — Voxtral Voice Setup${NC}"
echo -e "  ──────────────────────────────────"
echo ""

if [[ -z "$API_KEY" ]]; then
  echo -e "  ${R}✖${NC}  MISTRAL_API_KEY not found in .env.local"
  echo -e "     Run: read -rsp 'Mistral API key: ' K && echo \"MISTRAL_API_KEY=\$K\" >> $ENV_FILE"
  echo -e "     Then re-run this script."
  exit 1
fi

# ── 1. Generate reference audio via Kokoro (inside Docker network) ─────────
# The TTS container port is only reachable within Docker — use docker exec
echo -e "  Generating voice sample via Kokoro (docker exec)…"

docker exec vocazai-tts \
  python3 -c "
import requests, sys
r = requests.post('http://localhost:8000/tts', json={
    'text': 'Bonjour, je suis Yasmine, votre assistante vocale VocazAI.',
    'voice': 'af_heart',
    'speed': 0.92,
    'lang': 'fr-fr'
})
sys.stdout.buffer.write(r.content)
" > /tmp/yasmine_sample.wav 2>/dev/null

if [[ ! -s /tmp/yasmine_sample.wav ]]; then
  echo -e "  ${Y}⚠${NC}  Docker exec failed — trying via app proxy…"
  # Fallback: use app's /api/tts proxy
  curl -sf -X POST "http://localhost:${APP_PORT}/api/tts" \
    -H "Content-Type: application/json" \
    -d '{"text":"Bonjour, je suis Yasmine, votre assistante vocale VocazAI.","voice":"af_heart","speed":0.92,"lang":"fr-fr"}' \
    -o /tmp/yasmine_sample.wav || true
fi

if [[ ! -s /tmp/yasmine_sample.wav ]]; then
  echo -e "  ${R}✖${NC}  Could not generate voice sample."
  echo -e "     Check that vocazai-tts container is running: vocazai status"
  exit 1
fi

SIZE=$(du -h /tmp/yasmine_sample.wav | cut -f1)
echo -e "  ${G}✔${NC}  Sample generated (${SIZE})"

# ── 2. Convert to MP3 if ffmpeg available ─────────────────────────────────
if command -v ffmpeg &>/dev/null; then
  ffmpeg -y -i /tmp/yasmine_sample.wav \
    -codec:a libmp3lame -q:a 4 /tmp/yasmine_sample.mp3 -loglevel quiet 2>/dev/null
  SAMPLE_FILE="/tmp/yasmine_sample.mp3"
else
  SAMPLE_FILE="/tmp/yasmine_sample.wav"
fi

# ── 3. Base64-encode ────────────────────────────────────────────────────────
SAMPLE_B64=$(base64 -w 0 "$SAMPLE_FILE")
SAMPLE_FILENAME=$(basename "$SAMPLE_FILE")
echo -e "  Registering Yasmine voice with Mistral Voxtral…"

# ── 4. Create voice via Mistral API ────────────────────────────────────────
RESPONSE=$(curl -s -X POST https://api.mistral.ai/v1/audio/voices \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"yasmine-vocazai\",
    \"sample_audio\": \"$SAMPLE_B64\",
    \"sample_filename\": \"$SAMPLE_FILENAME\",
    \"languages\": [\"fr\", \"en\", \"ar\"],
    \"gender\": \"female\",
    \"tags\": [\"french\", \"vocazai\", \"yasmine\"]
  }")

VOICE_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

if [[ -z "$VOICE_ID" ]]; then
  echo -e "  ${R}✖${NC}  Mistral API error. Response:"
  echo "     $RESPONSE"
  exit 1
fi

echo -e "  ${G}✔${NC}  Voice created: ${BOLD}$VOICE_ID${NC}"

# ── 5. Save to .env.local ──────────────────────────────────────────────────
if grep -q '^MISTRAL_VOICE_ID=' "$ENV_FILE" 2>/dev/null; then
  sed -i "s|^MISTRAL_VOICE_ID=.*|MISTRAL_VOICE_ID=$VOICE_ID|" "$ENV_FILE"
else
  echo "MISTRAL_VOICE_ID=$VOICE_ID" >> "$ENV_FILE"
fi

echo -e "  ${G}✔${NC}  MISTRAL_VOICE_ID saved to .env.local"
echo ""

# ── 6. Restart app ─────────────────────────────────────────────────────────
echo -e "  Restarting app with Voxtral enabled…"
docker compose -f /var/www/vocazai-landing/docker-compose.yml \
  --env-file "$ENV_FILE" up -d app
sleep 3

# ── 7. Verify ──────────────────────────────────────────────────────────────
HEALTH=$(curl -sf --max-time 5 "http://localhost:${APP_PORT}/api/tts" 2>/dev/null || echo "{}")
ENGINE=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('engine','unknown'))" 2>/dev/null || echo "unknown")

echo ""
echo -e "  ${G}${BOLD}✅  Voxtral voice setup complete!${NC}"
echo ""
echo -e "  TTS engine : ${BOLD}$ENGINE${NC}"
echo -e "  Voice      : Yasmine (${VOICE_ID})"
echo -e "  Model      : voxtral-mini-tts-2603 · 4B params · native FR/EN/AR"
echo ""
