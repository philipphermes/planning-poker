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

# Copy everything from builder
COPY --from=builder /app ./

# Make node user own all files
RUN chown -R node:node /app

# Switch to node user
USER node

EXPOSE 3000
CMD ["npm", "start"]