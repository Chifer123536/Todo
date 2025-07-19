FROM node:20

# Устанавливаем Yarn глобально (надежно для CMD)
RUN npm install -g yarn

# Создаём рабочую директорию в контейнере
WORKDIR /app

# Копируем monorepo package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости из monorepo
RUN yarn install --frozen-lockfile

# Копируем весь проект (включая backend)
COPY . .

# Переходим в backend и билдим
WORKDIR /app/backend

# Сборка backend (NestJS)
RUN yarn build

# Открываем порт для сервера
EXPOSE 8080

# Запускаем backend
CMD ["yarn", "start"]
