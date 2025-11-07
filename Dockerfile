# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps
RUN apk add --no-cache python3 make g++

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY .npmrc .

# Install all dependencies
COPY . .
RUN pnpm install

# Build TypeScript
RUN pnpm run build

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

# Copy node_modules and built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
