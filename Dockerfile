ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /usr/src/app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

FROM deps as build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

COPY . .
RUN yarn run build

FROM base as final

ENV NODE_ENV production

# USER node


# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY package.json .

COPY --from=build --chown=hono:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=hono:nodejs /usr/src/app/dist ./dist

USER hono

EXPOSE 1247

CMD yarn start
