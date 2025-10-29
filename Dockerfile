# syntax=docker.io/docker/dockerfile:1
# ============================================
# Base Stage: Use a Lightweight Node.js Image
# ============================================

# Use an official Node.js Alpine image
ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base

# Set the working directory
WORKDIR /app

# ============================================
# Stage 2: Install dependencies
# ============================================
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Copy package related files
COPY package.json pnpm-lock.yaml ./

# Enable pnpm
RUN corepack enable pnpm

# Install dependencies 
RUN pnpm i --frozen-lockfile --prod

# ============================================
# Stage 3: Build Next.js app
# ============================================
FROM base AS builder

# Copy node modules from dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code into the container
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Following line disables telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application 
RUN npm run build

# ============================================
# Stage 4: Create Production Image
# ============================================
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy standalone build files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the port and hostname for the Next.js standalone server
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use nextjs user for security best practices
USER nextjs

# Expose port 3000
EXPOSE 3000

CMD ["node", "server.js"]