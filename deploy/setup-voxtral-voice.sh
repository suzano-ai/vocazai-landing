#!/usr/bin/env bash
# =============================================================================
# VocazAI — One-time Voxtral voice setup
# Génère un sample audio depuis Kokoro, crée une voix Yasmine chez Mistral,
# et sauvegarde le MISTRAL_VOICE_ID dans .env.local
#
# Usage: bash /var/www/vocazai-landing/deploy/setup-voxtral-voice.sh
# =============================================================================

set -e

ENV_FILE="/var/www/vocazai-landing/.env.local"
API_KEY="${MISTRAL_API_KEY:-$(grep '^MISTRAL_API_KEY=' "$ENV_FILE" 2>/dev/null | cut -d= -f2-)}"

R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m' C='\033[0;36m' BOLD='\033[1m' NC='\033[0m'

echo ""
echo -e "${BOLD}${C}  VocazAI — Voxtral Voice Setup${NC}"
echo -e "  ──────────────────────────────────"
echo ""

if [[ -z "$API_KEY" ]]; then
  echo -e "  ${R}✖${NC}  MISTRAL_API_KEY not found."
  echo -e "     Add it to .env.local:  MISTRAL_API_KEY=RmRvflP43IK2TicZrl9bPLUgubCW31YN"
  echo -e "     Then re-run this script."
  exit 1
fi

# ── 1. Generate reference audio via Kokoro ─────────────────────────────────
echo -e "  Generating voice sample via Kokoro…"
curl -sf -X POST http://localhost:8000/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Bonjour, je suis Yasmine, votre assistante vocale.","voice":"af_heart","speed":0.92,"lang":"fr-fr"}' \
  -o /tmp/yasmine_sample.wav

if [[ ! -s /tmp/yasmine_sample.wav ]]; then
  echo -e "  ${R}✖${NC}  Could not reach Kokoro TTS on port 8000."
  echo -e "     Make sure vocazai-tts container is running: vocazai status"
  exit 1
fi

echo -e "  ${G}✔${NC}  Sample generated ($(du -h /tmp/yasmine_sample.wav | cut -f1))"

# ── 2. Convert WAV to MP3 (smaller, better for API) ───────────────────────
if command -v ffmpeg &>/dev/null; then
  ffmpeg -y -i /tmp/yasmine_sample.wav -codec:a libmp3lame -q:a 4 /tmp/yasmine_sample.mp3 -loglevel quiet
  SAMPLE_FILE="/tmp/yasmine_sample.mp3"
  SAMPLE_MIME="audio/mpeg"
else
  SAMPLE_FILE="/tmp/yasmine_sample.wav"
  SAMPLE_MIME="audio/wav"
fi

# ── 3. Base64-encode the sample ────────────────────────────────────────────
SAMPLE_B64=$(base64 -w 0 "$SAMPLE_FILE")
SAMPLE_FILENAME=$(basename "$SAMPLE_FILE")

echo -e "  Registering Yasmine voice with Mistral Voxtral…"

# ── 4. Create voice via Mistral API ───────────────────────────────────────
RESPONSE=$(curl -sf -X POST https://api.mistral.ai/v1/audio/voices \
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
  echo -e "  ${R}✖${NC}  Failed to create voice. Response:"
  echo "  $RESPONSE"
  exit 1
fi

echo -e "  ${G}✔${NC}  Voice created: ${BOLD}$VOICE_ID${NC}"

# ── 5. Save to .env.local ─────────────────────────────────────────────────
if grep -q '^MISTRAL_API_KEY=' "$ENV_FILE" 2>/dev/null; then
  sed -i "s|^MISTRAL_API_KEY=.*|MISTRAL_API_KEY=$API_KEY|" "$ENV_FILE"
else
  echo "MISTRAL_API_KEY=$API_KEY" >> "$ENV_FILE"
fi

if grep -q '^MISTRAL_VOICE_ID=' "$ENV_FILE" 2>/dev/null; then
  sed -i "s|^MISTRAL_VOICE_ID=.*|MISTRAL_VOICE_ID=$VOICE_ID|" "$ENV_FILE"
else
  echo "MISTRAL_VOICE_ID=$VOICE_ID" >> "$ENV_FILE"
fi

echo -e "  ${G}✔${NC}  Saved to .env.local"
echo ""

# ── 6. Rebuild app to pick up new env vars ────────────────────────────────
echo -e "  Restarting app with Voxtral enabled…"
docker compose -f /var/www/vocazai-landing/docker-compose.yml \
  --env-file "$ENV_FILE" up -d app

echo ""
echo -e "  ${G}${BOLD}✅  Voxtral voice setup complete!${NC}"
echo ""
echo -e "  Engine  : Mistral Voxtral (voxtral-mini-tts-2603)"
echo -e "  Voice   : Yasmine (${VOICE_ID})"
echo -e "  Quality : 4B params · native French · ~90ms latency"
echo ""
echo -e "  Test it: curl -s http://localhost:3000/api/tts | python3 -c \"import sys,json; print(json.load(sys.stdin))\""
echo ""
