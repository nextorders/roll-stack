FROM node:22.18.0-slim AS base
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=/opt/ms-playwright

# Builder stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/database ./packages/database
COPY apps/web-parser ./apps/web-parser
RUN npm install --ignore-scripts -g pnpm && \
  pnpm i --frozen-lockfile && \
  pnpm build --filter @roll-stack/web-parser

# Production stage
FROM base AS production
WORKDIR /app

RUN npx playwright install chromium --with-deps --only-shell

# Copy built artifacts from builder
COPY --from=builder /app/apps/web-parser/.output .
COPY docker/web-parser/health-check.sh ./

# Running as non-root is a security best practice
# Make the Health check script executable
RUN groupadd -r appgroup && \
  useradd -r -g appgroup appuser && \
  chmod +x ./health-check.sh
USER appuser

# Configuration
ARG VERSION=nightly
LABEL maintainer="hmbanan666@hotmail.com" \
  description="WebParser" \
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