#!/usr/bin/env python3
"""
VocazAI — Register Yasmine voice with Mistral Voxtral
Run AFTER containers are up: python3 /var/www/vocazai-landing/deploy/register_voice.py
"""
import requests, base64, json, os, sys, subprocess

ENV_FILE = "/var/www/vocazai-landing/.env.local"

def read_env(key):
    try:
        for line in open(ENV_FILE):
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip()
    except FileNotFoundError:
        pass
    return ""

def write_env(key, value):
    try:
        content = open(ENV_FILE).read()
        if f"{key}=" in content:
            lines = [f"{key}={value}" if l.startswith(f"{key}=") else l
                     for l in content.splitlines()]
            open(ENV_FILE, "w").write("\n".join(lines) + "\n")
        else:
            open(ENV_FILE, "a").write(f"{key}={value}\n")
    except Exception as e:
        print(f"  ✖  Could not write to .env.local: {e}")

# ── 1. Check API key ──────────────────────────────────────────────────────────
api_key = read_env("MISTRAL_API_KEY") or os.environ.get("MISTRAL_API_KEY", "")
if not api_key:
    api_key = input("  › Mistral API key: ").strip()
    if not api_key:
        print("  ✖  No API key provided. Exiting.")
        sys.exit(1)

# ── 2. Generate voice sample via Kokoro (inside container) ───────────────────
print("\n  Generating voice sample via Kokoro...")

sample_bytes = None

# Try docker exec first (container-internal port 8000)
try:
    result = subprocess.run(
        ["docker", "exec", "vocazai-tts",
         "python3", "-c",
         "import requests,sys; r=requests.post('http://localhost:8000/tts',json={'text':'Bonjour, je suis Yasmine, votre assistante vocale VocazAI.','voice':'ff_siwis','speed':0.92,'lang':'fr-fr'}); sys.stdout.buffer.write(r.content)"],
        capture_output=True, timeout=30
    )
    if result.returncode == 0 and len(result.stdout) > 1000:
        sample_bytes = result.stdout
        print(f"  ✔  Sample via docker exec ({len(sample_bytes):,} bytes)")
except Exception as e:
    print(f"  ⚠  docker exec failed: {e}")

# Fallback: app proxy
if not sample_bytes:
    app_port = read_env("APP_PORT") or "3000"
    try:
        r = requests.post(
            f"http://localhost:{app_port}/api/tts",
            json={"text": "Bonjour, je suis Yasmine, votre assistante vocale VocazAI.",
                  "voice": "ff_siwis", "speed": 0.92, "lang": "fr-fr"},
            timeout=20
        )
        if r.status_code == 200 and len(r.content) > 1000:
            sample_bytes = r.content
            print(f"  ✔  Sample via app proxy ({len(sample_bytes):,} bytes)")
    except Exception as e:
        print(f"  ⚠  App proxy failed: {e}")

if not sample_bytes:
    print("  ✖  Could not generate voice sample.")
    print("     Make sure 'vocazai start' has completed and containers are running.")
    print("     Run: vocazai status")
    sys.exit(1)

# ── 3. Build and send payload ─────────────────────────────────────────────────
print("\n  Registering Yasmine voice with Mistral Voxtral...")

b64 = base64.b64encode(sample_bytes).decode()
payload = {
    "name": "yasmine-vocazai",
    "sample_audio": b64,
    "sample_filename": "yasmine_sample.wav",
    "languages": ["fr", "en", "ar"],
    "gender": "female",
    "tags": ["french", "vocazai", "yasmine"]
}

try:
    resp = requests.post(
        "https://api.mistral.ai/v1/audio/voices",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json=payload,
        timeout=30
    )
    data = resp.json()
except Exception as e:
    print(f"  ✖  API request failed: {e}")
    sys.exit(1)

# ── 4. Save voice ID ──────────────────────────────────────────────────────────
voice_id = data.get("id", "")

if voice_id:
    write_env("MISTRAL_VOICE_ID", voice_id)
    print(f"  ✔  Voice registered: {voice_id}")
    print(f"  ✔  MISTRAL_VOICE_ID saved to .env.local")
    print("\n  Restarting app to activate Voxtral TTS...")
    subprocess.run(["docker", "compose",
                    "-f", "/var/www/vocazai-landing/docker-compose.yml",
                    "--env-file", ENV_FILE,
                    "restart", "app"], capture_output=True)
    print("  ✔  Done — Yasmine now speaks with Voxtral\n")

elif "paid plan" in str(data).lower() or "subscription" in str(data).lower():
    print("  ℹ  Voxtral custom voices require a paid Mistral plan.")
    print("  ℹ  Demo will use Kokoro ff_siwis (native French) — no action needed.\n")

else:
    print(f"  ✖  Mistral API error: {json.dumps(data, indent=2)}")
    sys.exit(1)
