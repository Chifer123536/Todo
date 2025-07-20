# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Удаляем любой глобальный Yarn, ставим строго Yarn v1.22.22
RUN npm uninstall -g yarn \
 && npm install -g yarn@1.22.22

WORKDIR /app

# 2) Копируем весь репозиторий (lockfile, frontend, backend)
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

# 3) Устанавливаем все зависимости по frozen-lockfile (Yarn v1)
RUN yarn install --frozen-lockfile

# 4) Собираем только backend
RUN yarn workspace backend build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

# 1) Снова ставим Yarn v1, чтобы 'yarn start' работал
RUN npm uninstall -g yarn \
 && npm install -g yarn@1.22.22

WORKDIR /app

# 2) Копируем собранный backend и его зависимости
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 3) Копируем package.json, чтобы 'yarn start' нашёл скрипт
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 8080

# 4) Запускаем сервер
CMD ["node", "dist/main.js"]
