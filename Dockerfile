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

# Create node user/group
RUN addgroup -S node || true
RUN adduser -S node -G node -D -h /home/node || true

# Set working directory and give ownership to node
WORKDIR /app
RUN chown node:node /app

# Switch to node user
USER node

# Copy files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.cjs ./
COPY --from=builder /app/migrate.cjs ./
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]