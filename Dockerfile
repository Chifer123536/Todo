# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Устанавливаем Yarn v1, а не Corepack (какой у тебя локально)
RUN npm install -g yarn@1.22.22

WORKDIR /app

# 2) Копируем монорепозиторий
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

# 3) Ставим все зависимости (dev+prod) по frozen-lockfile
RUN yarn install --frozen-lockfile

# 4) Собираем NestJS в backend/dist
WORKDIR /app/backend
RUN yarn build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

WORKDIR /app

# 1) Копируем готовый backend
COPY --from=builder /app/backend/dist ./dist

# 2) Копируем node_modules из build-стейджа
COPY --from=builder /app/node_modules ./node_modules

# 3) Копируем package.json для запуска
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 8080

# 4) Запуск
CMD ["node", "dist/main.js"]
