FROM node:18

WORKDIR /app

# Копируем package.json и yarn.lock корня и бэкенда
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/package.json

# Устанавливаем зависимости (с учетом workspaces)
RUN yarn install --frozen-lockfile

# Копируем весь исходный код
COPY . .

# Собираем backend
RUN yarn workspace backend build

# Запускаем backend
CMD ["yarn", "workspace", "backend", "start"]
