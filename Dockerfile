# --------- STAGE 1: Build backend ---------
FROM node:20-slim AS base

# 1) Включаем Corepack/Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем корневые package.json, yarn.lock и весь код backend
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY backend ./backend

# 3) Устанавливаем ВСЕ зависимости backend (dev + prod)
RUN yarn workspaces focus backend --all

# 4) Собираем NestJS
WORKDIR /app/backend
RUN yarn build


# --------- STAGE 2: Production image ---------
FROM node:20-slim

# 1) Corepack/Yarn снова
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# 2) Копируем сборку + зависимости
COPY --from=base /app/backend/dist ./dist
COPY --from=base /app/backend/package.json ./
COPY --from=base /app/node_modules ./node_modules

EXPOSE 8080

# 3) Запускаем
CMD ["yarn", "start"]
