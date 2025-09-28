# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build
#RUN npm prune --production

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Create a non-root user and switch to it
RUN addgroup -S node || true
RUN adduser -S node -G node -D -h /home/node || true
USER node

EXPOSE 3000
CMD ["npm", "start"]
