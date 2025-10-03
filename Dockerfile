# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build
RUN npm prune --omit=dev

# Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.cjs ./
COPY --from=builder /app/migrate.cjs ./
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

RUN addgroup -S node || true
RUN adduser -S node -G node -D -h /home/node || true
USER node

EXPOSE 3000
CMD ["npm", "start"]