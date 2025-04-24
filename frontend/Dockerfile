# frontend/Dockerfile

# ── Builder stage ─────────────────────────────────────
FROM node:18-alpine AS builder
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Run stage ─────────────────────────────────────────
FROM node:18-alpine
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 8080
CMD ["npm", "run", "start", "--", "-p", "8080"]
