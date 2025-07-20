# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Corepack + Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем весь репозиторий (и frontend, и backend, и lockfile)
COPY . .

# 3) Устанавливаем все зависимости (dev + prod) и собираем backend
RUN yarn install --frozen-lockfile
RUN yarn workspace backend build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

WORKDIR /app

# 1) Копируем готовый бэкенд
COPY --from=builder /app/backend/dist ./dist

# 2) Берём только манифест бэкенда и lockfile для npm-install
COPY backend/package.json ./package.json

# 3) Устанавливаем продакшн‑зависимости **только бэкенда** через npm
RUN npm install --production

EXPOSE 8080

# 4) Запускаем собранный сервер
CMD ["node", "dist/main.js"]
