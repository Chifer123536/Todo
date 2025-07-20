# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Corepack + Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем репозиторий
COPY . .

# 3) Устанавливаем все зависимости строго по lockfile
RUN yarn install --immutable --immutable-cache

# 4) Собираем только backend
RUN yarn workspace backend build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

WORKDIR /app

# 1) Копируем собранный backend
COPY --from=builder /app/backend/dist ./dist

# 2) Копируем манифест бэкенда
COPY --from=builder /app/backend/package.json ./

# 3) Устанавливаем только прод‑зависимости бэкенда
RUN npm install --production

EXPOSE 8080

CMD ["node", "dist/main.js"]
