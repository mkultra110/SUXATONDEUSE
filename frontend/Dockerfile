# syntax=docker/dockerfile:1.7
# ─── Etape 1 : build Vite ──────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ARG VITE_BASE_PATH=/
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# Installation des dependances (cache dependance)
COPY package*.json ./
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/
RUN npm ci --workspaces --include-workspace-root

# Sources
COPY shared ./shared
COPY frontend ./frontend
COPY tsconfig.base.json ./

RUN npm run build --workspace=@robomow/shared
RUN npm run build --workspace=@robomow/frontend

# ─── Etape 2 : nginx production ────────────────────────────
FROM nginx:1.27-alpine AS production
RUN apk add --no-cache curl
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
