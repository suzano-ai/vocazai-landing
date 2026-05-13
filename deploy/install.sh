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

SERVER_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "unknown")

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 1 — Domain
# ══════════════════════════════════════════════════════════════════════════════
step "Domain configuration"
echo ""
echo -e "  ${DIM}Your server IP is: ${BOLD}${W}$SERVER_IP${NC}"
echo ""
ask "What is your domain name? (e.g. vocazai.com)"
echo -ne "  ${B}›${NC} "
read -r DOMAIN
DOMAIN="${DOMAIN#https://}" ; DOMAIN="${DOMAIN#http://}" ; DOMAIN="${DOMAIN%/}"
[[ -z "$DOMAIN" ]] && error "Domain cannot be empty."
DOMAIN_WWW="www.$DOMAIN"

echo ""
warn "Make sure these DNS A records exist BEFORE continuing:"
echo ""
echo -e "     ${BOLD}$DOMAIN${NC}     →  $SERVER_IP"
echo -e "     ${BOLD}$DOMAIN_WWW${NC}  →  $SERVER_IP"
echo ""
echo -e "  ${DIM}(Set them in your registrar or Hostinger DNS. Changes take 1-30 min.)${NC}"
echo ""
ask "Have you set the DNS records? [y/N]"
echo -ne "  ${B}›${NC} "
read -r DNS_READY
[[ ! "$DNS_READY" =~ ^[Yy]$ ]] && warn "You can re-run this script once DNS is ready." && exit 0

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 2 — SSL email
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

# ══════════════════════════════════════════════════════════════════════════════
#  STEP 4 — Confirm
# ══════════════════════════════════════════════════════════════════════════════
divider
step "Ready to install"
echo ""
echo -e "  Domain   : ${BOLD}https://$DOMAIN${NC}"
echo -e "  SSL email: $SSL_EMAIL"
echo -e "  Server IP: $SERVER_IP"
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

# Internal TTS service
TTS_SERVICE_URL=http://tts:8000
EOF
info ".env.local written"

# ── Patch domain into Traefik labels ─────────────────────────────────────────
step "Configuring domain"
sed -i "s/vocazai\.com/$DOMAIN/g"         "$APP_DIR/docker-compose.yml"
sed -i "s/www\.vocazai\.com/$DOMAIN_WWW/g" "$APP_DIR/docker-compose.yml"
sed -i "s/admin@vocazai\.com/$SSL_EMAIL/g" "$APP_DIR/deploy/traefik.yml"
info "Domain set to $DOMAIN"

# ── Launch stack ──────────────────────────────────────────────────────────────
step "Building and launching (this takes ~5 min on first run)"
echo -e "  ${DIM}Kokoro TTS model download ~320 MB — please wait…${NC}"
cd "$APP_DIR"
docker compose up -d --build 2>&1 | grep -E "(Step|=>|error|Error|✔|warn)" || true
info "All containers started"

# ── Wait for app ──────────────────────────────────────────────────────────────
step "Waiting for the app to be ready"
echo -ne "  "
for i in $(seq 1 24); do
  if curl -sf "http://127.0.0.1:3000/api/health" &>/dev/null; then
    echo ""
    info "App is healthy"
    break
  fi
  echo -ne "${C}.${NC}"
  sleep 5
done

# ══════════════════════════════════════════════════════════════════════════════
#  DONE
# ══════════════════════════════════════════════════════════════════════════════
echo ""
divider
echo ""
echo -e "${BOLD}${G}  ✅  VocazAI is live!${NC}"
echo ""
echo -e "  ${BOLD}🌐  https://$DOMAIN${NC}"
echo ""
echo -e "  ${DIM}Useful commands:${NC}"
echo -e "  ${DIM}  View logs    →  ${NC}docker compose -f $APP_DIR/docker-compose.yml logs -f app"
echo -e "  ${DIM}  Update app   →  ${NC}cd $APP_DIR && git pull && docker compose up -d --build app"
echo -e "  ${DIM}  Restart      →  ${NC}docker compose -f $APP_DIR/docker-compose.yml restart app"
echo -e "  ${DIM}  Stop all     →  ${NC}docker compose -f $APP_DIR/docker-compose.yml down"
echo ""
divider
echo ""
