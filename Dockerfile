FROM node:20-slim AS builder

RUN rm -f /usr/local/bin/yarn && npm install -g yarn@1.22.22

WORKDIR /app

COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

RUN yarn install --frozen-lockfile

WORKDIR /app/backend
RUN yarn build


FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 8080

CMD ["node", "dist/main.js"]
