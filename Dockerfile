# ---------- Base Builder Stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install all deps (prod + dev, since drizzle-kit is dev)
COPY package*.json ./
RUN npm install --production=false

# Copy app source
COPY . .

# Make sure drizzle.config.ts is copied (must be inside build context!)
COPY drizzle.config.ts ./drizzle.config.ts

# Build Next.js
RUN npm run build


# ---------- Migration Stage ----------
FROM builder AS migrator

# Run migrations using drizzle-kit
# (We keep dev deps here so npx drizzle-kit works)
RUN npx drizzle-kit push


# ---------- Production Runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy package.json for correct deps resolution
COPY --from=builder /app/package*.json ./

# Install only production deps
RUN npm install --production && npm cache clean --force

# Copy build output and public assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy drizzle config (not strictly needed at runtime, but safe)
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Create a non-root user
RUN addgroup -S node && adduser -S node -G node -h /home/node
USER node

EXPOSE 3000

# Start app
CMD ["npm", "start"]
