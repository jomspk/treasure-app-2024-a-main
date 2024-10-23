# syntax=docker/dockerfile:1

# builder
FROM node:22-slim AS builder

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

RUN npm run build

# runner
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder --chown=node:node  /app/dist ./dist
COPY --from=builder --chown=node:node  /app/node_modules ./node_modules

USER node

EXPOSE 8000

CMD ["node", "./dist/main.js"]
