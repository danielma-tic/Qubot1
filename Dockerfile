# Install dependencies only when needed
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn build
RUN npm run download
RUN npm run ingest


# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 gptgroup
RUN adduser --system --uid 1001 gptuser

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=gptuser:gptgroup /app/.next/standalone ./
COPY --from=builder --chown=gptuser:gptgroup /app/.next/static ./.next/static

USER gptuser

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
#CMD ["npm", "start"]