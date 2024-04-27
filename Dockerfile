FROM node:18-alpine3.17 As base
ARG PNPM_VERSION=8.5.1
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base As dependencies

WORKDIR /usr/src/app
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store\
     pnpm fetch
COPY package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
     pnpm install --frozen-lockfile

FROM dependencies As builder

WORKDIR /usr/src/app
COPY . .
RUN pnpm run build

FROM base
ENV NODE_ENV=production

WORKDIR /usr/src/app
RUN apk add dumb-init

USER node
COPY --chown=node:node --from=builder /usr/src/app/nest-cli.json ./nest-cli.json
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "start:prod"]
