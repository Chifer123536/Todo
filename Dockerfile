# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Corepack + Yarn v1
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем весь репозиторий (lockfile, frontend, backend)
COPY . .

# 3) Устанавливаем все зависимости (фиксируем lockfile)
RUN yarn install --frozen-lockfile

# 4) Собираем только backend
RUN yarn workspace backend build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

WORKDIR /app

# 1) Копируем готовый бэкенд
COPY --from=builder /app/backend/dist ./dist

# 2) Копируем весь node_modules из build-стейджа
COPY --from=builder /app/node_modules ./node_modules

# 3) Копируем package.json backend (для запуска скрипта)
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 8080

# 4) Запускаем собранный сервер
CMD ["node", "dist/main.js"]
