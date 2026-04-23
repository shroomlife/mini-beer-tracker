# syntax=docker/dockerfile:1.7
# ---------- Builder ----------
FROM oven/bun:1.3 AS builder
WORKDIR /app

# 1) Deps (ohne postinstall — das würde nuxt prepare + prisma generate ziehen,
#    bevor schema.prisma und nuxt.config.ts da sind)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts || bun install --ignore-scripts

# 2) Prisma-Schema + Client generieren
COPY prisma ./prisma
RUN bunx prisma generate

# 3) Rest des Projekts + Build
COPY . .
RUN bun run build

# ---------- Runtime ----------
FROM oven/bun:1.3-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NITRO_PORT=3000 \
    HOST=0.0.0.0 \
    DATABASE_URL="file:/data/mini-beer.db"

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p /data && chown -R bun:bun /data
USER bun
VOLUME ["/data"]
EXPOSE 3000

# Idempotenter Schema-Sync beim Start + Nitro-Server
CMD ["sh", "-c", "bunx prisma db push --skip-generate --accept-data-loss=false && bun run .output/server/index.mjs"]
