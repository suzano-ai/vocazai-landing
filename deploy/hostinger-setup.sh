#!/usr/bin/env bash
# =============================================================================
# VocazAI — Hostinger KVM VPS setup script
# =============================================================================
# Run this ONCE on a fresh Ubuntu 22.04 VPS as root.
#
#   bash deploy/hostinger-setup.sh
#
# What it does:
#   1. Installs Docker + Docker Compose
#   2. Creates the .env.local file from .env.example
#   3. Starts Traefik (reverse proxy + SSL) + the Next.js app
# =============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ---------- Root check -------------------------------------------------------
if [[ "$EUID" -ne 0 ]]; then
  error "Please run as root:  sudo bash deploy/hostinger-setup.sh"
fi

# ---------- 1. System update -------------------------------------------------
info "Updating system packages…"
apt-get update -qq && apt-get upgrade -y -qq

# ---------- 2. Docker --------------------------------------------------------
if ! command -v docker &>/dev/null; then
  info "Installing Docker…"
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  info "Docker $(docker --version) installed."
else
  info "Docker already installed — skipping."
fi

# ---------- 3. Docker Compose (v2 plugin) ------------------------------------
if ! docker compose version &>/dev/null; then
  info "Installing Docker Compose plugin…"
  apt-get install -y docker-compose-plugin -qq
fi
info "Docker Compose $(docker compose version --short) ready."

# ---------- 4. Environment variables ----------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_DIR/.env.local"

if [[ -f "$ENV_FILE" ]]; then
  warn ".env.local already exists — skipping. Edit manually if needed: nano $ENV_FILE"
else
  info "Creating .env.local…"
  cat > "$ENV_FILE" <<'EOF'
# VocazAI — Production environment variables
# Fill in ALL values before running docker compose up

NEXT_PUBLIC_APP_URL=https://vocazai.com

# Supabase (https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Vapi (https://dashboard.vapi.ai)
VAPI_API_KEY=
VAPI_WEBHOOK_SECRET=

# Retell (https://app.retellai.com)
RETELL_API_KEY=
RETELL_WEBHOOK_SECRET=
EOF
  warn "IMPORTANT: fill in your keys before starting the app!"
  warn "Run:  nano $ENV_FILE"
  echo ""
  read -rp "Press Enter when you've filled in .env.local to continue…"
fi

# ---------- 5. DNS reminder --------------------------------------------------
echo ""
warn "Make sure your DNS A records point to this server's IP:"
warn "  vocazai.com     → $(curl -s ifconfig.me)"
warn "  www.vocazai.com → $(curl -s ifconfig.me)"
echo ""
read -rp "Press Enter to continue (Traefik will auto-issue the SSL cert)…"

# ---------- 6. Launch --------------------------------------------------------
info "Building and starting VocazAI + Traefik…"
cd "$PROJECT_DIR"
docker compose up -d --build

# ---------- Done -------------------------------------------------------------
echo ""
echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}  VocazAI is live!  https://vocazai.com${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo "  View logs   : docker compose logs -f app"
echo "  Restart app : docker compose restart app"
echo "  Rebuild app : docker compose up -d --build app"
echo "  Stop all    : docker compose down"
echo ""
