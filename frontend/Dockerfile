# frontend/Dockerfile

# ── Builder stage ─────────────────────────────────────
FROM node:18-alpine AS builder

# Provide a default backend URL so builds never fail on missing env var
ARG NEXT_PUBLIC_API_URL=https://healytics-backend-213826089274.us-central1.run.app
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ── Run stage ─────────────────────────────────────────
FROM node:18-alpine AS runner

# Ensure the same env var is available at runtime (if you ever want to override it)
ARG NEXT_PUBLIC_API_URL=https://healytics-backend-213826089274.us-central1.run.app
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy built assets and install only production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 8080

# Start Next.js in production mode
CMD ["npm", "run", "start", "--", "-p", "8080"]
