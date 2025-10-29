FROM node:24.11.0-alpine AS base
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/atrium-telegram ./apps/atrium-telegram
RUN npm install --ignore-scripts -g pnpm && \
  pnpm i --frozen-lockfile && \
  pnpm build --filter @roll-stack/atrium-telegram

# Production stage
FROM base AS production
RUN apk add --no-cache curl
WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/apps/atrium-telegram/.output .
COPY docker/atrium-telegram/health-check.sh ./

# Running as non-root is a security best practice
# Make the Health check script executable
RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  chmod +x ./health-check.sh
USER appuser

# Configuration
ARG VERSION=nightly
LABEL maintainer="hmbanan666@hotmail.com" \
  description="Atrium Telegram" \
  version=${VERSION}
ENV VERSION=${VERSION} \
  NODE_ENV=production \
  PORT=3000 \
  HOST=0.0.0.0

EXPOSE 3000

# Health check using exec form
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD ["/app/health-check.sh"]

# Run the application
ENTRYPOINT ["node"]
CMD ["/app/server/index.mjs"]