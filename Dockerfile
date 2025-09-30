# ---------- Base Builder ----------
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .

# Build Next.js
RUN npm run build


# ---------- Migration Stage ----------
FROM node:18-alpine AS migrate
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=base /app/src ./src
# Run migrations when this stage is executed
CMD ["npx", "drizzle-kit", "push", "--config=drizzle.config.ts"]


# ---------- Production Runtime ----------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only production deps
COPY package*.json ./
RUN npm install --production

# Copy build output and public assets
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# Add non-root user (ignore if exists)
RUN addgroup -S node || true && adduser -S node -G node -h /home/node || true
USER node

EXPOSE 3000
CMD ["npm", "start"]
