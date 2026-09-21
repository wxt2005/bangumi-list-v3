# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.11.1

# ---- Build stage: install all dependencies and compile ----
FROM node:${NODE_VERSION}-bookworm AS builder

ARG GA_ID

ENV NEXT_PUBLIC_GA_ID=${GA_ID}
ENV NEXT_TELEMETRY_DISABLED=1
ENV HUSKY=0

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build -w packages/server && \
    API_HOST=http://127.0.0.1:3001 npm run build -w packages/client && \
    rm -rf packages/client/.next/cache

# ---- Production dependencies stage ----
FROM node:${NODE_VERSION}-bookworm AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/server/package.json packages/server/
COPY packages/client/package.json packages/client/
# The prepare script (husky) is dev-only and would fail without dev dependencies.
# npm installs both glibc and musl swc binaries; only the glibc one is used.
RUN --mount=type=cache,target=/root/.npm \
    npm pkg delete scripts.prepare && \
    npm ci --omit=dev && \
    rm -rf node_modules/@next/swc-*-musl

# ---- Runtime stage ----
FROM node:${NODE_VERSION}-bookworm-slim

ENV TZ=Asia/Shanghai
ENV NODE_ENV=production

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY --from=prod-deps /app ./
COPY start.sh ./
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/server/dist packages/server/dist
COPY --from=builder /app/packages/client/.next packages/client/.next
COPY packages/client/next.config.js packages/client/
COPY packages/client/public packages/client/public
# Prisma schema and migrations, so migrations can be run inside the container
COPY packages/server/prisma.config.ts packages/server/
COPY packages/server/src/prisma/schema.prisma packages/server/src/prisma/
COPY packages/server/src/prisma/migrations packages/server/src/prisma/migrations

EXPOSE 3000

CMD [ "/bin/sh", "./start.sh" ]
