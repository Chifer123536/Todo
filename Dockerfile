FROM node:20

# Создаём рабочую директорию в контейнере
WORKDIR /app

# Копируем monorepo package.json и yarn.lock
COPY package.json yarn.lock ./

# Включаем Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Устанавливаем зависимости 
RUN yarn install --frozen-lockfile

# Копируем весь проект
COPY . .

# Переходим в backend и билдим
WORKDIR /app/backend

# Сборка backend (NestJS)
RUN yarn build

# Открываем порт для сервера
EXPOSE 8080

# Запускаем backend
CMD ["yarn", "start"]
