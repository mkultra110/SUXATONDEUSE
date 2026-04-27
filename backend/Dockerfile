# syntax=docker/dockerfile:1.7
# ─── Etape 1 : dependances ─────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY backend/package.json ./backend/
COPY shared/package.json  ./shared/
RUN npm ci --workspaces --include-workspace-root

# ─── Etape 2 : build TS + Prisma generate ──────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY backend ./backend

RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build --workspace=@robomow/shared
RUN npm run build --workspace=@robomow/backend

# ─── Etape 3 : runtime production ──────────────────────────
FROM node:22-alpine AS production
RUN apk add --no-cache curl tini openssl
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY backend/package.json ./backend/
COPY shared/package.json  ./shared/
RUN npm ci --workspaces --include-workspace-root --omit=dev

COPY --from=builder /app/shared/dist           ./shared/dist
COPY --from=builder /app/backend/dist          ./backend/dist
COPY --from=builder /app/backend/prisma        ./backend/prisma
COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma  ./node_modules/@prisma

# Execution en utilisateur non-root
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy --schema=backend/prisma/schema.prisma && node backend/dist/server.js"]
