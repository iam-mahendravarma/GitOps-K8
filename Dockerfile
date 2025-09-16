# syntax=docker/dockerfile:1

# ---- Base builder image ----
FROM node:20-alpine AS base
WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runtime image ----
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Copy node_modules from builder for smaller image
COPY --from=base /app/node_modules ./node_modules

# Copy application source
COPY . .

EXPOSE 3000

# Healthcheck hits the health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', r => { if(r.statusCode!==200) process.exit(1); }).on('error', () => process.exit(1))" || exit 1

CMD ["npm", "start"]


