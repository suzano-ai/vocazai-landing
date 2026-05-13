#!/usr/bin/env bash
# ==============================================================================
#  VocazAI — One-line VPS installer
#  Run on a fresh Ubuntu 22.04 Hostinger VPS as root:
#
#    bash <(curl -fsSL https://raw.githubusercontent.com/suzano-ai/vocazai-landing/main/deploy/install.sh)
#
# ==============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m'
B='\033[0;34m' C='\033[0;36m' W='\033[1;37m'
DIM='\033[2m'  BOLD='\033[1m' NC='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
info()    { echo -e "  ${G}✔${NC}  $*"; }
warn()    { echo -e "  ${Y}⚠${NC}  $*"; }
error()   { echo -e "  ${R}✖${NC}  $*"; exit 1; }
step()    { echo -e "\n${BOLD}${C}▸ $*${NC}"; }
ask()     { echo -e "  ${B}?${NC}  ${BOLD}$1${NC}"; }
divider() { echo -e "${DIM}──────────────────────────────────────────────────────${NC}"; }

clear
echo ""
echo -e "${BOLD}${C}"
echo "  ██╗   ██╗ ██████╗  ██████╗ █████╗ ███████╗ █████╗ ██╗"
echo "  ██║   ██║██╔═══██╗██╔════╝██╔══██╗╚══███╔╝██╔══██╗██║"
echo "  ██║   ██║██║   ██║██║     ███████║  ███╔╝ ███████║██║"
echo "  ╚██╗ ██╔╝██║   ██║██║     ██╔══██║ ███╔╝  ██╔══██║██║"
echo "   ╚████╔╝ ╚██████╔╝╚██████╗██║  ██║███████╗██║  ██║██║"
echo "    ╚═══╝   ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝"
echo -e "${NC}"
echo -e "  ${DIM}VPS Installer — Hostinger KVM · Docker · Traefik · Kokoro TTS${NC}"
echo ""
divider
echo ""

# ── Root check ────────────────────────────────────────────────────────────────
[[ "$EUID" -ne 0 ]] && error "Please run as root: sudo bash deploy/install.sh"

# Force IPv4 — DNS A records require IPv4, not IPv6
SERVER_IP=$(curl -4 -s --max-time 5 ifconfig.me 2>/dev/null \
  || curl -4 -s --max-time 5 api.ipify.org 2>/dev/null \
  || curl -4 -s --max-time 5 ipv4.icanhazip.com 2>/dev/null \
  || echo "")

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 1 — Domain
# ══════════════════════════════════════════════════════════════════════════════
step "Domain configuration"
echo ""

if [[ -z "$SERVER_IP" ]]; then
  warn "Could not auto-detect your IPv4 address."
  ask "Enter your server IPv4 address manually (find it in Hostinger → VPS → Manage):"
  echo -ne "  ${B}›${NC} "
  read -r SERVER_IP
  [[ -z "$SERVER_IP" ]] && error "Server IP cannot be empty."
fi

echo ""
echo -e "  ${DIM}┌──────────────────────────────────────────────┐${NC}"
echo -e "  ${DIM}│${NC}  ${BOLD}Your server IPv4 address:${NC}                    ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}                                              ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}      ${BOLD}${C}${SERVER_IP}${NC}                              ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}                                              ${DIM}│${NC}"
echo -e "  ${DIM}│${NC}  ${DIM}Copy this — you will need it in your DNS     │${NC}"
echo -e "  ${DIM}└──────────────────────────────────────────────┘${NC}"
echo ""

ask "What is your domain name? (e.g. vocazai.com)"
echo -ne "  ${B}›${NC} "
read -r DOMAIN
DOMAIN="${DOMAIN#https://}" ; DOMAIN="${DOMAIN#http://}" ; DOMAIN="${DOMAIN%/}"
[[ -z "$DOMAIN" ]] && error "Domain cannot be empty."
DOMAIN_WWW="www.$DOMAIN"

echo ""
echo -e "  ${BOLD}${Y}  DNS records to create${NC}"
echo ""
echo -e "  ${DIM}Go to your domain registrar or Hostinger DNS panel and add:${NC}"
echo ""
echo -e "  ${DIM}  ┌────────┬────────┬───────────────────┬──────┐${NC}"
echo -e "  ${DIM}  │${NC} ${BOLD}Type${NC}   ${DIM}│${NC} ${BOLD}Name${NC}   ${DIM}│${NC} ${BOLD}Value (IP)${NC}         ${DIM}│${NC} ${BOLD}TTL${NC}  ${DIM}│${NC}"
echo -e "  ${DIM}  ├────────┼────────┼───────────────────┼──────┤${NC}"
echo -e "  ${DIM}  │${NC}  A     ${DIM}│${NC}  @     ${DIM}│${NC}  ${C}${BOLD}${SERVER_IP}${NC}  ${DIM}│${NC}  300 ${DIM}│${NC}"
echo -e "  ${DIM}  │${NC}  A     ${DIM}│${NC}  www   ${DIM}│${NC}  ${C}${BOLD}${SERVER_IP}${NC}  ${DIM}│${NC}  300 ${DIM}│${NC}"
echo -e "  ${DIM}  └────────┴────────┴───────────────────┴──────┘${NC}"
echo ""
echo -e "  ${DIM}  • Type  = A  (not AAAA, not CNAME)${NC}"
echo -e "  ${DIM}  • Name  = @  means your root domain (${DOMAIN})${NC}"
echo -e "  ${DIM}  • Value = the IPv4 address above${NC}"
echo -e "  ${DIM}  • TTL   = 300 or Auto — both are fine${NC}"
echo ""
echo -e "  ${DIM}  DNS changes take 1–30 minutes to propagate.${NC}"
echo -e "  ${DIM}  Run ${BOLD}vocazai domain${NC}${DIM} after install to verify.${NC}"
echo ""
ask "Have you added the DNS records? [y/N]"
echo -ne "  ${B}›${NC} "
read -r DNS_READY
[[ ! "$DNS_READY" =~ ^[Yy]$ ]] && echo "" && warn "No problem — re-run this installer once your DNS is ready." && exit 0

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 2 — Internal port
# ══════════════════════════════════════════════════════════════════════════════
echo ""
divider
step "Internal app port"
echo ""
echo -e "  ${DIM}Each project on this server needs its own internal port.${NC}"
echo -e "  ${DIM}Traefik routes ${BOLD}vocazai.com${NC}${DIM} → that port automatically.${NC}"
echo -e "  ${DIM}Users never see this port — it's internal only.${NC}"
echo ""

# Show which ports are already taken
USED_PORTS=$(ss -tlnp 2>/dev/null | awk 'NR>1{print $4}' | grep -oP ':\K\d+$' | sort -n | tr '\n' ' ')
if [[ -n "$USED_PORTS" ]]; then
  echo -e "  ${DIM}Ports already in use on this server: ${BOLD}${USED_PORTS}${NC}"
  echo ""
fi

ask "Which port should VocazAI run on? (press Enter for 3001)"
echo -ne "  ${B}›${NC} "
read -r APP_PORT_INPUT
APP_PORT="${APP_PORT_INPUT:-3001}"

# Validate it's a number
[[ ! "$APP_PORT" =~ ^[0-9]+$ ]] && error "Port must be a number (e.g. 3001)"

# Check if port is already in use
if ss -tlnp 2>/dev/null | grep -q ":${APP_PORT} "; then
  warn "Port ${APP_PORT} is already in use."
  ask "Use it anyway? (the process using it may conflict) [y/N]"
  echo -ne "  ${B}›${NC} "
  read -r PORT_FORCE
  [[ ! "$PORT_FORCE" =~ ^[Yy]$ ]] && warn "Pick a different port and re-run." && exit 0
fi

info "VocazAI will run internally on port ${APP_PORT}"

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 3 — SSL email
# ══════════════════════════════════════════════════════════════════════════════
echo ""
ask "Email for SSL certificate (Let's Encrypt notifications):"
echo -ne "  ${B}›${NC} "
read -r SSL_EMAIL
[[ -z "$SSL_EMAIL" ]] && error "Email cannot be empty."

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 3 — Environment variables (API keys)
# ══════════════════════════════════════════════════════════════════════════════
divider
step "API keys"
echo ""
echo -e "  ${DIM}Get these from your dashboards. Press Enter to skip any key for now${NC}"
echo -e "  ${DIM}(you can edit them later in ${BOLD}.env.local${NC}${DIM})${NC}"
echo ""

ask "Supabase project URL  (https://xxx.supabase.co):"
echo -ne "  ${B}›${NC} "
read -r SUPABASE_URL

ask "Supabase anon key:"
echo -ne "  ${B}›${NC} "
read -r SUPABASE_ANON_KEY

ask "Supabase service role key:"
echo -ne "  ${B}›${NC} "
read -r SUPABASE_SERVICE_KEY

ask "Vapi API key:"
echo -ne "  ${B}›${NC} "
read -r VAPI_KEY

ask "Vapi webhook secret:"
echo -ne "  ${B}›${NC} "
read -r VAPI_SECRET

ask "Retell API key:"
echo -ne "  ${B}›${NC} "
read -r RETELL_KEY

ask "Retell webhook secret:"
echo -ne "  ${B}›${NC} "
read -r RETELL_SECRET

echo ""
echo -e "  ${BOLD}${C}▸ Voice AI keys${NC}  ${DIM}(for the live Yasmine demo)${NC}"
echo ""
ask "Mistral API key  (api.mistral.ai → API Keys):"
echo -ne "  ${B}›${NC} "
read -r MISTRAL_KEY

ask "Resend API key   (resend.com → API Keys — for confirmation emails):"
echo -ne "  ${B}›${NC} "
read -r RESEND_KEY

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 4 — Confirm
# ══════════════════════════════════════════════════════════════════════════════
divider
step "Ready to install"
echo ""
echo -e "  Domain    : ${BOLD}https://$DOMAIN${NC}"
echo -e "  Port      : ${BOLD}$APP_PORT${NC}  ${DIM}(internal — not public)${NC}"
echo -e "  SSL email : $SSL_EMAIL"
echo -e "  Server IP : $SERVER_IP"
echo ""
ask "Start installation? [Y/n]"
echo -ne "  ${B}›${NC} "
read -r CONFIRM
[[ "$CONFIRM" =~ ^[Nn]$ ]] && echo "" && warn "Cancelled." && exit 0

# ══════════════════════════════════════════════════════════════════════════════
#  INSTALLATION
# ══════════════════════════════════════════════════════════════════════════════
APP_DIR="/var/www/vocazai-landing"
REPO="https://github.com/suzano-ai/vocazai-landing.git"

echo ""
divider

# ── System update ─────────────────────────────────────────────────────────────
step "Updating system"
apt-get update -qq && apt-get upgrade -y -qq
info "System up to date"

# ── Docker ────────────────────────────────────────────────────────────────────
step "Installing Docker"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh -s -- -q
  systemctl enable --now docker
  info "Docker installed"
else
  info "Docker already installed"
fi

if ! docker compose version &>/dev/null 2>&1; then
  apt-get install -y docker-compose-plugin -qq
fi
info "Docker Compose ready"

# ── Git ───────────────────────────────────────────────────────────────────────
step "Installing Git"
apt-get install -y git -qq
info "Git ready"

# ── Clone repo ────────────────────────────────────────────────────────────────
step "Cloning VocazAI"
if [[ -d "$APP_DIR/.git" ]]; then
  warn "Repo already exists — pulling latest changes"
  git -C "$APP_DIR" pull --ff-only
else
  git clone "$REPO" "$APP_DIR"
fi
info "Code ready at $APP_DIR"

# ── .env.local ────────────────────────────────────────────────────────────────
step "Writing environment variables"
cat > "$APP_DIR/.env.local" <<EOF
# VocazAI — Production environment
# Generated by install.sh on $(date)

NEXT_PUBLIC_APP_URL=https://${DOMAIN}
DOMAIN=${DOMAIN}
APP_PORT=${APP_PORT}

# Supabase
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_KEY}

# Vapi
VAPI_API_KEY=${VAPI_KEY}
VAPI_WEBHOOK_SECRET=${VAPI_SECRET}

# Retell
RETELL_API_KEY=${RETELL_KEY}
RETELL_WEBHOOK_SECRET=${RETELL_SECRET}

# Mistral Voxtral TTS
MISTRAL_API_KEY=${MISTRAL_KEY}
MISTRAL_VOICE_ID=

# Resend — confirmation emails
RESEND_API_KEY=${RESEND_KEY}

# Internal TTS service (Kokoro fallback)
TTS_SERVICE_URL=http://tts:8000
STT_SERVICE_URL=http://stt:9000
EOF
info ".env.local written"

# ── Patch SSL email into Traefik config ───────────────────────────────────────
step "Configuring domain + SSL"
sed -i "s/admin@vocazai\.com/$SSL_EMAIL/g" "$APP_DIR/deploy/traefik.yml"
info "SSL email set to $SSL_EMAIL"
info "Domain: $DOMAIN (port $APP_PORT internally)"

# ── Shared Docker network ─────────────────────────────────────────────────────
step "Setting up shared network"
if docker network inspect traefik_net &>/dev/null; then
  info "Shared network traefik_net already exists — reusing"
else
  docker network create traefik_net
  info "Created shared network traefik_net"
fi

# ── Traefik — start only if not already running ───────────────────────────────
step "Checking Traefik"
if docker ps --format '{{.Names}}' | grep -q '^traefik$'; then
  info "Traefik already running — skipping (shared with other projects)"
else
  info "Starting Traefik reverse proxy"
  cd "$APP_DIR"
  docker compose -f "$APP_DIR/docker-compose.yml" --env-file "$APP_DIR/.env.local" up -d traefik
fi

# ── Build and launch app + TTS ────────────────────────────────────────────────
step "Building and launching app (this takes ~5 min on first run)"
echo -e "  ${DIM}Kokoro TTS model download ~320 MB — please wait…${NC}"
cd "$APP_DIR"
docker compose -f docker-compose.yml --env-file .env.local up -d --build app tts 2>&1 | grep -E "(Step|=>|error|Error|warn)" || true
info "All containers started"

# ── Wait for app ──────────────────────────────────────────────────────────────
step "Waiting for the app to be ready"
echo -ne "  "
for i in $(seq 1 24); do
  if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" &>/dev/null; then
    echo ""
    info "App is healthy on port $APP_PORT"
    break
  fi
  echo -ne "${C}.${NC}"
  sleep 5
done

# ── Install vocazai CLI ───────────────────────────────────────────────────────
step "Installing vocazai CLI"
cp "$APP_DIR/deploy/vocazai-cli.sh" /usr/local/bin/vocazai
chmod +x /usr/local/bin/vocazai
info "vocazai CLI installed → run 'vocazai' from anywhere"

# ══════════════════════════════════════════════════════════════════════════════
#  DONE
# ══════════════════════════════════════════════════════════════════════════════
echo ""
divider
echo ""
echo -e "${BOLD}${G}  ✅  VocazAI is live!${NC}"
echo ""
echo -e "  ${BOLD}🌐  https://$DOMAIN${NC}"
echo -e "  ${DIM}    internal port $APP_PORT · shared Traefik${NC}"
echo ""
echo -e "  ${DIM}Manage your stack with the${NC} ${BOLD}vocazai${NC} ${DIM}CLI:${NC}"
echo ""
echo -e "  ${BOLD}  vocazai doctor${NC}       ${DIM}full health check"
echo -e "  ${BOLD}  vocazai update${NC}       ${DIM}pull latest code + rebuild"
echo -e "  ${BOLD}  vocazai logs${NC}         ${DIM}live app logs"
echo -e "  ${BOLD}  vocazai status${NC}       ${DIM}container status"
echo -e "  ${BOLD}  vocazai restart${NC}      ${DIM}restart the app"
echo -e "  ${BOLD}  vocazai env${NC}          ${DIM}edit API keys"
echo -e "  ${BOLD}  vocazai ssl${NC}          ${DIM}check SSL certificate${NC}"
echo ""
divider
echo ""
