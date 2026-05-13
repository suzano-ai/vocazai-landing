#!/usr/bin/env bash
# ==============================================================================
#  VocazAI CLI — /usr/local/bin/vocazai
#  Install: bash /var/www/vocazai-landing/deploy/vocazai-cli.sh --install
# ==============================================================================

APP_DIR="/var/www/vocazai-landing"
ENV_FILE="$APP_DIR/.env.local"
# --env-file makes compose substitute ${DOMAIN}, ${APP_PORT} etc from .env.local
COMPOSE="docker compose -f $APP_DIR/docker-compose.yml --env-file $ENV_FILE"

# Helper: read a value from .env.local
_env() { grep -E "^${1}=" "$ENV_FILE" 2>/dev/null | cut -d= -f2- || echo ""; }

# ── Colours ───────────────────────────────────────────────────────────────────
R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m'
B='\033[0;34m' C='\033[0;36m' W='\033[1;37m'
DIM='\033[2m'  BOLD='\033[1m' NC='\033[0m'

ok()      { echo -e "  ${G}✔${NC}  $*"; }
fail()    { echo -e "  ${R}✖${NC}  $*"; }
warn()    { echo -e "  ${Y}⚠${NC}  $*"; }
info()    { echo -e "  ${C}ℹ${NC}  $*"; }
step()    { echo -e "\n${BOLD}${W}$*${NC}"; }
divider() { echo -e "${DIM}──────────────────────────────────────────────────────${NC}"; }

header() {
  clear
  echo ""
  echo -e "${BOLD}${C}  VocazAI CLI${NC}  ${DIM}v1.0${NC}"
  divider
}

# ══════════════════════════════════════════════════════════════════════════════
#  SELF-INSTALL
# ══════════════════════════════════════════════════════════════════════════════
if [[ "${1:-}" == "--install" ]]; then
  cp "$APP_DIR/deploy/vocazai-cli.sh" /usr/local/bin/vocazai
  chmod +x /usr/local/bin/vocazai
  echo -e "${G}✔${NC}  vocazai CLI installed. Run ${BOLD}vocazai${NC} from anywhere."
  exit 0
fi

# ══════════════════════════════════════════════════════════════════════════════
#  HELP
# ══════════════════════════════════════════════════════════════════════════════
show_help() {
  header
  echo ""
  echo -e "  ${BOLD}Usage:${NC}  vocazai <command>"
  echo ""
  echo -e "  ${BOLD}${C}Management${NC}"
  echo -e "  ${BOLD}  update${NC}              Pull code, update CLI, rebuild changed services"
  echo -e "  ${BOLD}  update --all${NC}        Force rebuild of ALL services (tts + stt + app)"
  echo -e "  ${BOLD}  start${NC}               Start all services"
  echo -e "  ${BOLD}  stop${NC}                Stop all services"
  echo -e "  ${BOLD}  restart${NC} [service]   Restart app / tts / traefik (default: app)"
  echo -e "  ${BOLD}  status${NC}              Show status of all containers"
  echo -e "  ${BOLD}  logs${NC} [service]      Live logs — app / tts / traefik (default: app)"
  echo ""
  echo -e "  ${BOLD}${C}Diagnostics${NC}"
  echo -e "  ${BOLD}  doctor${NC}              Full health check of the entire stack"
  echo -e "  ${BOLD}  domain${NC}              Check domain DNS and SSL"
  echo -e "  ${BOLD}  ssl${NC}                 Show SSL certificate details"
  echo -e "  ${BOLD}  tts${NC}                 Live Voxtral synthesis test + Kokoro status"
  echo -e "  ${BOLD}  stt${NC}                 Check Faster-Whisper STT service"
  echo ""
  echo -e "  ${BOLD}${C}Configuration${NC}"
  echo -e "  ${BOLD}  env${NC}                 Open .env.local in editor"
  echo -e "  ${BOLD}  env show${NC}            Print current env vars (keys only, values hidden)"
  echo -e "  ${BOLD}  backup${NC}              Backup .env.local with timestamp"
  echo ""
  echo -e "  ${DIM}Examples:${NC}"
  echo -e "  ${DIM}  vocazai doctor${NC}"
  echo -e "  ${DIM}  vocazai logs tts${NC}"
  echo -e "  ${DIM}  vocazai restart app${NC}"
  echo ""
  divider
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  DOCTOR — full health check
# ══════════════════════════════════════════════════════════════════════════════
cmd_doctor() {
  header
  echo ""
  echo -e "  ${BOLD}Running health checks…${NC}"
  echo ""
  PASS=0; FAIL=0; WARN=0

  _ok()   { ok   "$1"; ((PASS++)); }
  _fail() { fail "$1"; ((FAIL++)); }
  _warn() { warn "$1"; ((WARN++)); }

  # 1. Docker
  step "Docker"
  if command -v docker &>/dev/null; then
    _ok "Docker $(docker --version | grep -oP '\d+\.\d+\.\d+')"
  else
    _fail "Docker not installed"
  fi
  if docker compose version &>/dev/null 2>&1; then
    _ok "Docker Compose $(docker compose version --short)"
  else
    _fail "Docker Compose not found"
  fi

  # 2. Containers
  step "Containers"
  for svc in traefik vocazai-app vocazai-tts vocazai-stt; do
    STATUS=$(docker inspect --format='{{.State.Status}}' "$svc" 2>/dev/null || echo "missing")
    HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$svc" 2>/dev/null || echo "")
    if [[ "$STATUS" == "running" ]]; then
      _ok "$svc  ${DIM}running${NC}${G}"
    else
      _fail "$svc  ${DIM}$STATUS${NC}"
    fi
  done

  # 3. App health endpoint
  step "App"
  APP_PORT=$(_env APP_PORT); APP_PORT="${APP_PORT:-3000}"
  HEALTH_RESP=$(curl -sf --max-time 5 "http://127.0.0.1:${APP_PORT}/api/health" 2>/dev/null || echo "")
  if [[ -n "$HEALTH_RESP" ]]; then
    APP_STATUS=$(echo "$HEALTH_RESP" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    _ok "Health endpoint  ${DIM}→ $APP_STATUS${NC}${G}"
  else
    _fail "Health endpoint not responding"
  fi

  # 4. TTS service
  step "Kokoro TTS"
  TTS_RESP=$(curl -sf --max-time 10 http://127.0.0.1:3000/api/tts 2>/dev/null || echo "")
  if echo "$TTS_RESP" | grep -q '"model_loaded":true'; then
    _ok "TTS model loaded and ready  ${DIM}(voice: $(echo "$TTS_RESP" | grep -o '"voice":"[^"]*"' | cut -d'"' -f4))${NC}${G}"
  elif echo "$TTS_RESP" | grep -q '"model_loaded":false'; then
    _warn "TTS service up but model still loading"
  else
    _fail "TTS service not responding"
  fi

  # 5. STT service
  step "Faster-Whisper STT"
  STT_RESP=$(curl -sf --max-time 10 http://127.0.0.1:3000/api/stt 2>/dev/null || echo "")
  if echo "$STT_RESP" | grep -q '"model_loaded":true'; then
    _ok "STT model loaded and ready"
  elif echo "$STT_RESP" | grep -q '"model_loaded":false'; then
    _warn "STT service up but model still loading"
  elif docker inspect --format='{{.State.Status}}' vocazai-stt 2>/dev/null | grep -q running; then
    _warn "STT container running but not reachable via app proxy"
  else
    _fail "STT service not running"
  fi

  # 5. Domain & DNS
  step "Domain & DNS"
  DOMAIN=$(_env DOMAIN)
  if [[ -n "$DOMAIN" ]]; then
    SERVER_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "")
    DNS_IP=$(dig +short "$DOMAIN" 2>/dev/null | tail -1 || echo "")
    if [[ "$DNS_IP" == "$SERVER_IP" ]]; then
      _ok "DNS for $DOMAIN → $DNS_IP"
    elif [[ -z "$DNS_IP" ]]; then
      _warn "DNS for $DOMAIN not resolving yet"
    else
      _warn "DNS for $DOMAIN → $DNS_IP (expected $SERVER_IP)"
    fi
  else
    _warn "Could not detect domain from docker-compose.yml"
  fi

  # 6. SSL
  step "SSL Certificate"
  if [[ -n "${DOMAIN:-}" ]]; then
    CERT_INFO=$(echo | timeout 5 openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")
    if [[ -n "$CERT_INFO" ]]; then
      EXPIRY=$(echo "$CERT_INFO" | grep 'notAfter' | cut -d= -f2)
      EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
      NOW_EPOCH=$(date +%s)
      DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
      if [[ $DAYS_LEFT -gt 14 ]]; then
        _ok "SSL valid — expires in ${DAYS_LEFT} days"
      elif [[ $DAYS_LEFT -gt 0 ]]; then
        _warn "SSL expiring soon — ${DAYS_LEFT} days left"
      else
        _fail "SSL certificate expired"
      fi
    else
      _warn "Could not verify SSL (DNS may not be propagated yet)"
    fi
  fi

  # 7. Disk & memory
  step "Resources"
  DISK_USED=$(df -h / | awk 'NR==2{print $5}' | tr -d '%')
  MEM_FREE=$(free -m | awk '/^Mem:/{print $4}')
  [[ $DISK_USED -lt 80 ]] && _ok "Disk usage ${DISK_USED}%" || _warn "Disk usage ${DISK_USED}% — getting full"
  [[ $MEM_FREE -gt 200 ]] && _ok "Free memory ${MEM_FREE} MB" || _warn "Low memory — ${MEM_FREE} MB free"

  # 8. .env.local
  step "Configuration"
  if [[ -f "$ENV_FILE" ]]; then
    MISSING_KEYS=()
    for key in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY VAPI_API_KEY RETELL_API_KEY; do
      VAL=$(grep "^${key}=" "$ENV_FILE" 2>/dev/null | cut -d= -f2-)
      [[ -z "$VAL" ]] && MISSING_KEYS+=("$key")
    done
    if [[ ${#MISSING_KEYS[@]} -eq 0 ]]; then
      _ok ".env.local — all keys present"
    else
      _warn ".env.local — missing: ${MISSING_KEYS[*]}"
    fi
  else
    _fail ".env.local not found"
  fi

  # ── Summary ────────────────────────────────────────────────────────────────
  echo ""
  divider
  echo ""
  TOTAL=$((PASS + FAIL + WARN))
  echo -e "  ${BOLD}Results:${NC}  ${G}${PASS} passed${NC}  ${R}${FAIL} failed${NC}  ${Y}${WARN} warnings${NC}  ${DIM}/ ${TOTAL} checks${NC}"
  echo ""
  if [[ $FAIL -eq 0 && $WARN -eq 0 ]]; then
    echo -e "  ${G}${BOLD}✅  Everything looks great!${NC}"
  elif [[ $FAIL -eq 0 ]]; then
    echo -e "  ${Y}${BOLD}⚠   Stack is running but needs attention.${NC}"
  else
    echo -e "  ${R}${BOLD}✖   Some checks failed. Run ${NC}${BOLD}vocazai logs${NC}${R}${BOLD} to investigate.${NC}"
  fi
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  UPDATE  — pull + keys + voice setup + rebuild, all in one
# ══════════════════════════════════════════════════════════════════════════════
cmd_update() {
  header
  FLAG="${1:-}"

  # ── 1. Pull latest code ───────────────────────────────────────────────────
  step "① Pulling latest code"
  git -C "$APP_DIR" pull --ff-only
  echo ""

  # ── 2. Reinstall CLI so new commands are live immediately ─────────────────
  step "② Updating CLI"
  cp "$APP_DIR/deploy/vocazai-cli.sh" /usr/local/bin/vocazai
  chmod +x /usr/local/bin/vocazai
  ok "vocazai CLI updated"
  echo ""

  # ── 3. Check / prompt for every required API key ─────────────────────────
  step "③ API keys"

  _upsert_key() {
    local KEY="$1" LABEL="$2" URL="$3" SECRET="${4:-yes}"
    local CURRENT=$(_env "$KEY")
    if [[ -z "$CURRENT" ]]; then
      warn "${BOLD}$KEY${NC} is missing"
      echo -e "  ${DIM}Get it at: $URL${NC}"
    else
      echo -ne "  ${DIM}$KEY already set — press Enter to keep, or paste new value: ${NC}"
    fi
    if [[ "$SECRET" == "yes" ]]; then
      read -rsp "  › $LABEL: " NEW_VAL; echo
    else
      read -rp  "  › $LABEL: " NEW_VAL
    fi
    if [[ -n "$NEW_VAL" ]]; then
      # Replace existing line or append
      if grep -q "^${KEY}=" "$ENV_FILE" 2>/dev/null; then
        sed -i "s|^${KEY}=.*|${KEY}=${NEW_VAL}|" "$ENV_FILE"
      else
        echo "${KEY}=${NEW_VAL}" >> "$ENV_FILE"
      fi
      ok "$KEY updated"
    else
      [[ -n "$CURRENT" ]] && ok "$KEY kept" || warn "$KEY skipped — some features may not work"
    fi
  }

  _upsert_key "MISTRAL_API_KEY" "Mistral API key"  "https://console.mistral.ai/api-keys"
  _upsert_key "RESEND_API_KEY"  "Resend API key"   "https://resend.com/api-keys"
  echo ""

  # ── 4. Voxtral voice setup (if no voice ID yet) ───────────────────────────
  MISTRAL_KEY=$(_env "MISTRAL_API_KEY")
  VOICE_ID=$(_env "MISTRAL_VOICE_ID")

  if [[ -n "$MISTRAL_KEY" && -z "$VOICE_ID" ]]; then
    step "④ Registering Yasmine voice with Mistral Voxtral"

    # Generate audio sample via Kokoro container
    info "Generating reference audio via Kokoro…"
    docker exec vocazai-tts \
      python3 -c "
import requests, sys
r = requests.post('http://localhost:8000/tts', json={
    'text': 'Bonjour, je suis Yasmine, votre assistante vocale VocazAI.',
    'voice': 'af_heart', 'speed': 0.92, 'lang': 'fr-fr'
})
sys.stdout.buffer.write(r.content)
" > /tmp/yasmine_sample.wav 2>/dev/null || true

    # Fallback: app proxy
    if [[ ! -s /tmp/yasmine_sample.wav ]]; then
      APP_PORT=$(_env APP_PORT); APP_PORT="${APP_PORT:-3000}"
      curl -sf -X POST "http://localhost:${APP_PORT}/api/tts" \
        -H "Content-Type: application/json" \
        -d '{"text":"Bonjour, je suis Yasmine, votre assistante vocale VocazAI.","voice":"af_heart","speed":0.92,"lang":"fr-fr"}' \
        -o /tmp/yasmine_sample.wav 2>/dev/null || true
    fi

    if [[ ! -s /tmp/yasmine_sample.wav ]]; then
      warn "Could not generate voice sample — run 'vocazai update' again after 'vocazai start'"
    else
      # Convert to MP3 if ffmpeg available
      SAMPLE_FILE="/tmp/yasmine_sample.wav"
      if command -v ffmpeg &>/dev/null; then
        ffmpeg -y -i /tmp/yasmine_sample.wav -codec:a libmp3lame -q:a 4 \
          /tmp/yasmine_sample.mp3 -loglevel quiet 2>/dev/null && SAMPLE_FILE="/tmp/yasmine_sample.mp3"
      fi

      SAMPLE_FNAME=$(basename "$SAMPLE_FILE")
      PAYLOAD_FILE="/tmp/yasmine_voice_payload.json"
      # Pipe base64 through stdin — never touches shell argument list
      base64 -w 0 "$SAMPLE_FILE" | python3 -c "
import json, sys
payload = {
  'name': 'yasmine-vocazai',
  'sample_audio': sys.stdin.read().strip(),
  'sample_filename': '$SAMPLE_FNAME',
  'languages': ['fr', 'en', 'ar'],
  'gender': 'female',
  'tags': ['french', 'vocazai', 'yasmine']
}
print(json.dumps(payload))
" > "$PAYLOAD_FILE"

      RESPONSE=$(curl -s -X POST https://api.mistral.ai/v1/audio/voices \
        -H "Authorization: Bearer $MISTRAL_KEY" \
        -H "Content-Type: application/json" \
        -d "@$PAYLOAD_FILE")

      NEW_VOICE_ID=$(echo "$RESPONSE" | python3 -c \
        "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

      if [[ -n "$NEW_VOICE_ID" ]]; then
        if grep -q "^MISTRAL_VOICE_ID=" "$ENV_FILE" 2>/dev/null; then
          sed -i "s|^MISTRAL_VOICE_ID=.*|MISTRAL_VOICE_ID=$NEW_VOICE_ID|" "$ENV_FILE"
        else
          echo "MISTRAL_VOICE_ID=$NEW_VOICE_ID" >> "$ENV_FILE"
        fi
        ok "Yasmine voice registered → ${BOLD}$NEW_VOICE_ID${NC}${G}"
      elif echo "$RESPONSE" | grep -qi "paid plan\|subscription\|upgrade"; then
        info "Voxtral custom voice requires a paid Mistral plan — skipping"
        info "Demo will use Kokoro ff_siwis (native French) instead  ${DIM}✓${NC}"
      fi
    fi
    echo ""
  elif [[ -n "$VOICE_ID" ]]; then
    step "④ Voxtral voice"
    ok "Voice ID already set → ${DIM}${VOICE_ID:0:12}…${NC}${G}  (skip)"
    echo ""
  else
    step "④ Voxtral voice"
    warn "MISTRAL_API_KEY not set — voice setup skipped"
    echo ""
  fi

  # ── 5. Rebuild services ───────────────────────────────────────────────────
  if [[ "$FLAG" == "--all" ]]; then
    step "⑤ Rebuilding ALL services (tts + stt + app)"
    DOCKER_BUILDKIT=1 $COMPOSE up -d --build tts stt app
  else
    REBUILD_SVCS="app"
    if git -C "$APP_DIR" diff --name-only HEAD@{1} HEAD 2>/dev/null \
        | grep -qE '^services/tts/'; then
      REBUILD_SVCS="tts $REBUILD_SVCS"
      info "TTS source changed — will rebuild tts"
    fi
    if git -C "$APP_DIR" diff --name-only HEAD@{1} HEAD 2>/dev/null \
        | grep -qE '^services/stt/'; then
      REBUILD_SVCS="stt $REBUILD_SVCS"
      info "STT source changed — will rebuild stt"
    fi
    step "⑤ Rebuilding: $REBUILD_SVCS"
    DOCKER_BUILDKIT=1 $COMPOSE up -d --build $REBUILD_SVCS
  fi

  echo ""
  ok "${BOLD}Update complete ✅${NC}${G}  ${DIM}(use ${NC}${BOLD}vocazai update --all${NC}${DIM} to force-rebuild tts+stt)${NC}"
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  STATUS
# ══════════════════════════════════════════════════════════════════════════════
cmd_status() {
  header
  echo ""
  $COMPOSE ps
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  LOGS
# ══════════════════════════════════════════════════════════════════════════════
cmd_logs() {
  SVC="${1:-app}"
  echo -e "\n${DIM}Streaming logs for ${BOLD}$SVC${NC}${DIM} — Ctrl+C to exit${NC}\n"
  $COMPOSE logs -f --tail=100 "$SVC"
}

# ══════════════════════════════════════════════════════════════════════════════
#  RESTART / START / STOP
# ══════════════════════════════════════════════════════════════════════════════
cmd_restart() {
  SVC="${1:-app}"
  header
  step "Restarting $SVC"
  $COMPOSE restart "$SVC"
  ok "$SVC restarted"
  echo ""
}

cmd_start() {
  header
  step "Starting all services"
  $COMPOSE up -d
  ok "All services started"
  echo ""
}

cmd_stop() {
  header
  step "Stopping all services"
  $COMPOSE down
  ok "All services stopped"
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  ENV
# ══════════════════════════════════════════════════════════════════════════════
cmd_env() {
  SUBCMD="${1:-edit}"
  if [[ "$SUBCMD" == "show" ]]; then
    header
    echo ""
    echo -e "  ${BOLD}.env.local keys:${NC}"
    echo ""
    grep -v '^#' "$ENV_FILE" | grep '=' | while IFS='=' read -r key val; do
      [[ -z "$key" ]] && continue
      if [[ -n "$val" ]]; then
        MASKED="${val:0:6}••••••••"
        echo -e "  ${G}✔${NC}  ${BOLD}$key${NC}  ${DIM}= $MASKED${NC}"
      else
        echo -e "  ${Y}⚠${NC}  ${BOLD}$key${NC}  ${DIM}= (empty)${NC}"
      fi
    done
    echo ""
  else
    ${EDITOR:-nano} "$ENV_FILE"
    echo ""
    warn "Restart the app for changes to take effect: vocazai restart app"
    echo ""
  fi
}

# ══════════════════════════════════════════════════════════════════════════════
#  BACKUP
# ══════════════════════════════════════════════════════════════════════════════
cmd_backup() {
  header
  BACKUP_FILE="${ENV_FILE}.backup-$(date +%Y%m%d-%H%M%S)"
  cp "$ENV_FILE" "$BACKUP_FILE"
  ok "Backed up to $BACKUP_FILE"
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  DOMAIN — detailed DNS inspector
# ══════════════════════════════════════════════════════════════════════════════
cmd_domain() {
  header
  command -v dig  &>/dev/null || apt-get install -y -qq dnsutils
  command -v curl &>/dev/null || apt-get install -y -qq curl

  DOMAIN=$(_env DOMAIN)
  [[ -z "$DOMAIN" ]] && fail "Could not detect domain from docker-compose.yml" && exit 1
  DOMAIN_WWW="www.$DOMAIN"
  SERVER_IP=$(curl -4 -s --max-time 5 ifconfig.me 2>/dev/null || curl -4 -s --max-time 5 api.ipify.org 2>/dev/null || echo "unknown")

  # ── Public DNS resolvers to cross-check propagation ──────────────────────
  declare -A RESOLVERS=(
    ["Cloudflare"]="1.1.1.1"
    ["Google"]="8.8.8.8"
    ["OpenDNS"]="208.67.222.222"
    ["Quad9"]="9.9.9.9"
  )

  _check_record() {
    local HOST="$1" TYPE="$2" RESOLVER="$3"
    dig +short "$TYPE" "$HOST" "@$RESOLVER" 2>/dev/null | grep -v '^;' | tail -1 || echo ""
  }

  _ttl() {
    dig "$1" "$2" 2>/dev/null | awk '/ANSWER SECTION/{f=1;next} f && /'"$2"'/{print $2; exit}' || echo "—"
  }

  echo ""
  echo -e "  ${BOLD}${W}Your server IP${NC}  →  ${BOLD}${C}$SERVER_IP${NC}"
  echo ""
  divider

  # ── A Records ─────────────────────────────────────────────────────────────
  for HOST in "$DOMAIN" "$DOMAIN_WWW"; do
    echo ""
    echo -e "  ${BOLD}A record — $HOST${NC}"
    echo ""

    ALL_MATCH=true
    ANY_RESOLVES=false

    for NAME in "${!RESOLVERS[@]}"; do
      IP=$(_check_record "$HOST" "A" "${RESOLVERS[$NAME]}")
      if [[ -z "$IP" ]]; then
        echo -e "  ${Y}⚠${NC}  ${DIM}$NAME (${RESOLVERS[$NAME]})${NC}  →  ${Y}not resolving yet${NC}"
      elif [[ "$IP" == "$SERVER_IP" ]]; then
        echo -e "  ${G}✔${NC}  ${DIM}$NAME (${RESOLVERS[$NAME]})${NC}  →  ${G}${IP}${NC}  ${DIM}✓ matches${NC}"
        ANY_RESOLVES=true
      else
        echo -e "  ${R}✖${NC}  ${DIM}$NAME (${RESOLVERS[$NAME]})${NC}  →  ${R}${IP}${NC}  ${DIM}← wrong IP${NC}"
        ALL_MATCH=false
        ANY_RESOLVES=true
      fi
    done

    TTL=$(_ttl "$HOST" "A")
    echo ""
    echo -e "  ${DIM}TTL : ${TTL}s   (how long DNS servers cache this record)${NC}"

    echo ""
    if $ALL_MATCH && $ANY_RESOLVES; then
      ok "$HOST is fully propagated ✓"
    elif ! $ANY_RESOLVES; then
      warn "$HOST — not resolving on any resolver yet. DNS changes take 1–30 min."
      echo ""
      echo -e "  ${DIM}Set this record in your registrar / Hostinger DNS panel:${NC}"
      echo ""
      echo -e "  ${BOLD}  Type : A${NC}"
      echo -e "  ${BOLD}  Name : $(echo "$HOST" | sed "s/\.$DOMAIN$//" | sed "s/$DOMAIN/@/")${NC}"
      echo -e "  ${BOLD}  Value: $SERVER_IP${NC}"
      echo -e "  ${BOLD}  TTL  : 300 (or Auto)${NC}"
    else
      warn "$HOST — partially propagated or wrong IP on some resolvers"
      echo ""
      echo -e "  ${DIM}Expected value: ${BOLD}$SERVER_IP${NC}"
    fi
    divider
  done

  # ── CNAME www check ───────────────────────────────────────────────────────
  echo ""
  echo -e "  ${BOLD}CNAME — $DOMAIN_WWW (alternative to A record)${NC}"
  echo ""
  CNAME=$(dig +short CNAME "$DOMAIN_WWW" 2>/dev/null | tail -1 || echo "")
  if [[ -n "$CNAME" ]]; then
    echo -e "  ${C}ℹ${NC}  CNAME → ${BOLD}$CNAME${NC}  ${DIM}(using CNAME instead of A record — OK)${NC}"
  else
    echo -e "  ${DIM}No CNAME set (using A record — OK)${NC}"
  fi

  # ── Overall summary ───────────────────────────────────────────────────────
  echo ""
  divider
  echo ""
  A_MAIN=$(_check_record "$DOMAIN"     "A" "1.1.1.1")
  A_WWW=$( _check_record "$DOMAIN_WWW" "A" "1.1.1.1")

  if [[ "$A_MAIN" == "$SERVER_IP" && "$A_WWW" == "$SERVER_IP" ]]; then
    ok "${BOLD}All DNS records are correct and propagated.${NC}${G}"
    echo ""
    echo -e "  ${DIM}You can now run ${BOLD}vocazai ssl${NC}${DIM} to verify your SSL certificate.${NC}"
  else
    echo -e "  ${Y}${BOLD}⚠  DNS not fully propagated yet.${NC}"
    echo ""
    echo -e "  ${DIM}Required records to set in your DNS panel:${NC}"
    echo ""
    echo -e "  ${BOLD}  Type   Name    Value          TTL${NC}"
    echo -e "  ${DIM}  ─────  ──────  ─────────────  ─────${NC}"
    echo -e "  ${BOLD}  A      @       $SERVER_IP   300${NC}"
    echo -e "  ${BOLD}  A      www     $SERVER_IP   300${NC}"
    echo ""
    echo -e "  ${DIM}After saving, wait 5–30 min then run ${BOLD}vocazai domain${NC}${DIM} again.${NC}"
  fi
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  SSL
# ══════════════════════════════════════════════════════════════════════════════
cmd_ssl() {
  header
  DOMAIN=$(_env DOMAIN)
  [[ -z "$DOMAIN" ]] && fail "Could not detect domain." && exit 1
  echo ""
  echo -e "  Checking SSL for ${BOLD}$DOMAIN${NC}…"
  echo ""
  CERT=$(echo | timeout 8 openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -text 2>/dev/null || echo "")
  if [[ -n "$CERT" ]]; then
    SUBJECT=$(echo "$CERT"  | grep "Subject:" | head -1 | xargs)
    ISSUER=$(echo "$CERT"   | grep "Issuer:"  | head -1 | xargs)
    EXPIRY=$(echo "$CERT"   | grep "Not After" | head -1 | sed 's/.*Not After : //')
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
    DAYS_LEFT=$(( (EXPIRY_EPOCH - $(date +%s)) / 86400 ))
    ok "$SUBJECT"
    info "$ISSUER"
    [[ $DAYS_LEFT -gt 14 ]] && ok "Expires in ${BOLD}${DAYS_LEFT} days${NC}${G}  ($EXPIRY)" \
                              || warn "Expires in ${BOLD}${DAYS_LEFT} days${NC}  ($EXPIRY)"
  else
    fail "Could not retrieve certificate. DNS may not be propagated yet."
  fi
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  TTS — live Voxtral synthesis test + Kokoro container status
# ══════════════════════════════════════════════════════════════════════════════
cmd_tts() {
  header
  echo ""

  MISTRAL_KEY=$(_env "MISTRAL_API_KEY")
  VOICE_ID=$(_env "MISTRAL_VOICE_ID")
  APP_PORT=$(_env APP_PORT); APP_PORT="${APP_PORT:-3000}"

  # ── Voxtral live test ─────────────────────────────────────────────────────
  step "Mistral Voxtral TTS — live test"
  if [[ -z "$MISTRAL_KEY" ]]; then
    warn "MISTRAL_API_KEY not set — run 'vocazai update' to add it"
  elif [[ -z "$VOICE_ID" ]]; then
    info "No custom MISTRAL_VOICE_ID — Voxtral test skipped (requires paid plan)"
    info "TTS engine: Kokoro ff_siwis (native French female)"
  else
    echo -e "  ${DIM}Voice ID  : ${VOICE_ID:0:16}…${NC}"
    echo -e "  ${DIM}Model     : voxtral-mini-tts-2603${NC}"
    echo -e "  ${DIM}Testing synthesis…${NC}"
    echo ""

    TTS_OUT="/tmp/yasmine_tts_test.mp3"
    TTS_PAYLOAD="{\"model\":\"voxtral-mini-tts-2603\",\"input\":\"Bonjour, je suis Yasmine, votre assistante VocazAI. Le système fonctionne parfaitement.\",\"voice\":\"$VOICE_ID\",\"response_format\":\"mp3\"}"
    HTTP_CODE=$(curl -s -o "$TTS_OUT" -w "%{http_code}" \
      -X POST "https://api.mistral.ai/v1/audio/speech" \
      -H "Authorization: Bearer $MISTRAL_KEY" \
      -H "Content-Type: application/json" \
      -d "$TTS_PAYLOAD" 2>/dev/null)

    if [[ "$HTTP_CODE" == "200" ]] && [[ -s "$TTS_OUT" ]]; then
      SIZE=$(du -h "$TTS_OUT" | cut -f1)
      ok "${G}Voxtral synthesis OK${NC}  ${DIM}→ ${SIZE} audio generated${NC}"
      ok "Saved to ${BOLD}$TTS_OUT${NC}"
      echo ""
      echo -e "  ${DIM}Play with:  ${BOLD}aplay $TTS_OUT${NC}${DIM}  or  ${BOLD}mpg123 $TTS_OUT${NC}"
    else
      # Show error response
      ERR=$(cat "$TTS_OUT" 2>/dev/null || echo "no response")
      fail "Voxtral API returned HTTP $HTTP_CODE"
      echo -e "  ${DIM}Response: $ERR${NC}"
      echo ""
      warn "Check MISTRAL_API_KEY and MISTRAL_VOICE_ID — run 'vocazai update' to fix"
    fi
  fi

  echo ""
  divider

  # ── Kokoro container status ───────────────────────────────────────────────
  step "Kokoro TTS container (fallback)"
  CONTAINER=$(docker inspect --format='{{.State.Status}}' vocazai-tts 2>/dev/null || echo "missing")
  [[ "$CONTAINER" == "running" ]] && ok "vocazai-tts  ${DIM}running${NC}${G}" \
                                   || fail "vocazai-tts  ${DIM}$CONTAINER${NC}"

  APP_RESP=$(curl -sf --max-time 8 "http://127.0.0.1:${APP_PORT}/api/tts" 2>/dev/null || echo "{}")
  ENGINE=$(echo "$APP_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('engine','?'))" 2>/dev/null || echo "?")
  echo -e "  Active engine : ${BOLD}$ENGINE${NC}"
  echo ""
  echo -e "  ${DIM}Kokoro logs (last 10):${NC}"
  docker logs vocazai-tts --tail=10 2>&1 || true
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  STT
# ══════════════════════════════════════════════════════════════════════════════
cmd_stt() {
  header
  echo ""
  step "Faster-Whisper STT Service"
  CONTAINER=$(docker inspect --format='{{.State.Status}}' vocazai-stt 2>/dev/null || echo "missing")
  echo -e "  Container : $CONTAINER"
  HEALTH=$(curl -sf --max-time 10 http://127.0.0.1:3000/api/stt 2>/dev/null || echo "{}")
  echo -e "  Response  : $HEALTH"
  echo ""
  echo -e "  ${DIM}Live logs (last 20 lines):${NC}"
  echo ""
  docker logs vocazai-stt --tail=20 2>&1 || true
  echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
#  ROUTER
# ══════════════════════════════════════════════════════════════════════════════
CMD="${1:-help}"
shift || true

case "$CMD" in
  doctor)             cmd_doctor ;;
  update)             cmd_update "${1:-}" ;;
  status)             cmd_status ;;
  logs)               cmd_logs "${1:-app}" ;;
  restart)            cmd_restart "${1:-app}" ;;
  start)              cmd_start ;;
  stop)               cmd_stop ;;
  env)                cmd_env "${1:-edit}" ;;
  backup)             cmd_backup ;;
  domain)             cmd_domain ;;
  ssl)                cmd_ssl ;;
  tts)                cmd_tts ;;
  stt)                cmd_stt ;;
  help|--help|-h|"")  show_help ;;
  *)
    echo -e "\n  ${R}Unknown command:${NC} $CMD\n"
    show_help
    exit 1
    ;;
esac
