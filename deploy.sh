#!/usr/bin/env bash
# Bitlis Sehrim — VPS tek komut deploy (Docker Compose + Prisma migrate)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker bulunamadi. Lutfen Docker Engine kurun."
  exit 1
fi

COMPOSE="${COMPOSE:-docker compose}"
if ! $COMPOSE version >/dev/null 2>&1; then
  COMPOSE="docker-compose"
fi

echo "==> Gorselleri cek / yeniden derle"
$COMPOSE pull 2>/dev/null || true
$COMPOSE build --pull

echo "==> Konteynerleri baslat"
$COMPOSE up -d

echo "==> Veritabani migrasyonlari"
$COMPOSE exec -T bitlis_api npx prisma migrate deploy

echo "==> Tamam. Saglik kontrolu:"
curl -sf "${PUBLIC_API_URL:-http://127.0.0.1:3001}/api/health" | head -c 200 || true
echo ""
