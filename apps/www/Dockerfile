FROM node:18 AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=www --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18 AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN yarn global add pnpm
RUN yarn global add turbo

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN corepack enable

RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .

RUN turbo build --filter=www

FROM node:18 AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/www/next.config.mjs .
COPY --from=installer /app/apps/www/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/.next/static ./apps/www/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/www/public ./apps/www/public

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD [ "node", "apps/www/server.mjs" ]
# ENTRYPOINT ["tail", "-f", "/dev/null"]