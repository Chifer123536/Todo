FROM node:20-slim AS builder

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

RUN yarn install --immutable

WORKDIR /app/backend
RUN yarn build

FROM node:20-slim

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/

RUN yarn workspaces focus backend --production

WORKDIR /app/dist
EXPOSE 8080

CMD ["node", "main.js"]
