# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS builder

# 1) Corepack + Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем монорепо-манифесты и исходники backend
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

# 3) Устанавливаем ВСЕ зависимости (dev+prod) для корректного билда
RUN yarn workspaces focus backend --all

# 4) Собираем NestJS
WORKDIR /app/backend
RUN yarn build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

# Corepack + Yarn (чтобы yarn start работал)
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 1) Копируем собранную папку dist
COPY --from=builder /app/backend/dist ./dist

# 2) Копируем всю node_modules из build-стейджа
COPY --from=builder /app/node_modules ./node_modules

# 3) Копируем package.json чтобы yarn start мог найти main
COPY --from=builder /app/backend/package.json ./

EXPOSE 8080

# 4) Запускаем напрямую
CMD ["node", "dist/main.js"]
