 # Build stage
  FROM node:18-alpine AS builder
  WORKDIR /app

  COPY package*.json ./
  RUN npm install --production=false # Installs all dependencies (dev and prod)

  COPY . .
  COPY ../drizzle.config.ts .
  RUN mkdir -p /app/db
  RUN npm run build
  #RUN npm prune --production # Keep this commented out here, as drizzle-kit needs dev dependencies

  # Production stage
  FROM node:18-alpine AS runner
  WORKDIR /app

  ENV NODE_ENV=production
  COPY --from=builder /app/package*.json ./
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  #COPY --from=builder /app/node_modules ./node_modules # Copies all node_modules from builder

  # Create a non-root user and switch to it
  RUN addgroup -S node || true
  RUN adduser -S node -G node -D -h /home/node || true
  USER node

  EXPOSE 3000

  # --- START: Modified CMD instruction ---
  # 1. Run Drizzle migrations
  # 2. If successful, prune dev dependencies (removes them from node_modules at runtime)
  # 3. If successful, start the application
  CMD ["sh", "-c", "npx drizzle-kit push && npm prune --production && npm start"]
