#!/usr/bin/env bash
set -euo pipefail
umask 077

image=${1:?Pass an image digest}
[[ "$image" =~ ^ghcr\.io/[a-z0-9-]+/[a-z0-9._-]+@sha256:[0-9a-f]{64}$ ]]
cd "$(dirname "$0")/.."

if [[ ! -s .env.production || ! -s deploy-data/image.env ]]; then
  printf 'Complete the first deployment and database restore before running CD.\n' >&2
  exit 1
fi

exec 9>deploy-data/deploy.lock
flock 9

export FENIX_IMAGE="$image"
compose=(docker compose --env-file .env.production --env-file deploy-data/image.env -f compose.prod.yaml)
if [[ -z "$("${compose[@]}" ps --status running -q postgres)" || -z "$("${compose[@]}" ps --all -q app)" ]]; then
  printf 'The existing production PostgreSQL must be running and the site must have been deployed once.\n' >&2
  exit 1
fi

"${compose[@]}" pull app
"${compose[@]}" run --rm --no-deps -T nginx nginx -t
"${compose[@]}" run --rm --no-deps -T app npx --no-install prisma migrate deploy
"${compose[@]}" up -d --no-deps --wait app
"${compose[@]}" up -d --no-deps --force-recreate nginx
"${compose[@]}" exec -T nginx nginx -t
printf 'FENIX_IMAGE=%s\n' "$image" > deploy-data/image.env.next
mv deploy-data/image.env.next deploy-data/image.env
