# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies 
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm i --frozen-lockfile

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Following line disables telemetry.
ENV NEXT_TELEMETRY_DISABLED=1

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/bin/sh", "/docker-entrypoint.sh"]
CMD ["npm", "run", "start"]