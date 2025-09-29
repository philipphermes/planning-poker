# ---------- Build Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies (dev + prod, because drizzle-kit is a dev dep)
COPY package*.json ./
RUN npm install --production=false

# Copy app source
COPY . .
COPY drizzle.config.ts ./drizzle.config.ts

# Build Next.js
RUN npm run build


# ---------- Production Runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package files for npm resolution
COPY --from=builder /app/package*.json ./

# Copy build output and assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy dependencies (including dev, needed for drizzle at runtime)
COPY --from=builder /app/node_modules ./node_modules

# Copy drizzle config
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Create a non-root user
RUN addgroup -S node && adduser -S node -G node -h /home/node
USER node

EXPOSE 3000

# Run migrations, prune dev deps, then start app
CMD ["sh", "-c", "npx drizzle-kit push && npm prune --production && npm start"]
