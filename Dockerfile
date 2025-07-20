# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1. Corepack + Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2. Копируем монорепо-манифесты и исходники backend
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

# 3. Устанавливаем все зависимости (dev+prod) для корректного билда
RUN yarn workspaces focus backend --all

# 4. Собираем NestJS в dist/
WORKDIR /app/backend
RUN yarn build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

# 1. Corepack + Yarn (чистый слой)
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2. Копируем собранную dist-папку
COPY --from=builder /app/backend/dist ./dist

# 3. Копируем манифесты для установки прод-зависимостей
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/

# 4. Устанавливаем ТОЛЬКО production-зависимости backend
RUN yarn workspaces focus backend --production

# 5. Переносим node_modules в dist (чтобы среди root лежали только dist и ничего лишнего)
RUN mv node_modules dist/

# 6. Устанавливаем рабочую директорию в dist и открываем порт
WORKDIR /app/dist
EXPOSE 8080

# 7. Запуск
CMD ["node", "main.js"]
