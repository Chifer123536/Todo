FROM node:20

# Создаём рабочую папку в контейнере
WORKDIR /app

# Копируем package.json и yarn.lock из backend в контейнер
COPY package.json yarn.lock ./

# Включаем corepack и yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Устанавливаем зависимости 
RUN yarn install --frozen-lockfile

# Копируем весь код
COPY . .

# Сборка проекта 
RUN yarn build

# Открываем порт приложения
EXPOSE 8080

# Запускаем бек
CMD ["yarn", "start"]
