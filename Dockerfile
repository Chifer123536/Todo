# --------- STAGE 1: Build backend ---------

FROM node:20-slim AS base 

# Устанавливаем Yarn глобально (вместо npm)
RUN corepack enable && corepack prepare yarn@stable --activate

# Создаём рабочую директорию внутри контейнера
WORKDIR /app

# Копируем корневые файлы монорепозитория (для Yarn Workspaces)
COPY package.json yarn.lock ./

# Копируем package.json backend'а для корректной установки зависимостей
COPY backend/package.json ./backend/

# Устанавливаем только необходимые зависимости backend-а через workspaces
RUN yarn workspaces focus backend --production

# Копируем весь исходный код backend-а (src, tsconfig и т.д.)
COPY backend ./backend

# Переходим в директорию backend
WORKDIR /app/backend

# Собираем backend (NestJS → dist/)
RUN yarn build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

# Устанавливаем Yarn снова (этот слой "чистый", без dev-инструментов)
RUN npm install -g yarn

# Создаём рабочую директорию
WORKDIR /app

# Копируем собранный backend из предыдущего слоя
COPY --from=base /app/backend/dist ./dist
COPY --from=base /app/backend/package.json ./
COPY --from=base /app/backend/node_modules ./node_modules

# Открываем порт 8080 для внешнего доступа к серверу
EXPOSE 8080

# Запускаем backend
CMD ["yarn", "start"]
