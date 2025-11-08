# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps
RUN apk add --no-cache python3 make g++

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev - has Prisma CLI)
RUN pnpm install --frozen-lockfile

# Copy source files including Prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build TypeScript
RUN pnpm run build

# Remove devDependencies so node_modules contains only production deps
# This makes copying node_modules into the runtime stage safe and small
RUN pnpm prune --prod

# Runtime stage
FROM node:20-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lock (already present) and copy production node_modules from builder
COPY package.json pnpm-lock.yaml ./

# Copy production node_modules and built application from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (needed for migrations in production if you run them)
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]