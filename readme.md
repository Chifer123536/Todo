# Todo App

Full-stack task manager built with **Next.js**, **NestJS**, **TypeScript**, **MongoDB**, and **Redis**.

## Features

- User authentication: register, login, email verification, password reset
- 2FA and OAuth (Google & Yandex)
- CRUD for todos with pagination
- User profile & theme settings (light/dark)
- Email notifications via SMTP
- Custom animations and error messaging

## Tech Stack

| Layer      | Tech                            |
| ---------- | ------------------------------- |
| Frontend   | Next.js 15, React 19            |
| Backend    | NestJS 11                       |
| DB         | MongoDB + Mongoose              |
| Cache      | Redis                           |
| Auth       | Sessions, 2FA, OAuth, ReCAPTCHA |
| Styles     | Tailwind CSS, SCSS Modules      |
| Forms      | React Hook Form + Zod           |
| State      | React Query                     |
| UI Kit     | Radix UI, Lucide Icons          |
| Animations | Framer Motion                   |
| Testing    | Jest + React Testing Library    |

## Project Structure

```
/Todo
├── backend
│   ├── src
│   │   ├── auth
│   │   ├── todo
│   │   └── user
│   └── .env.example
└── frontend
    ├── public/screenshots/
    ├── src
    │   ├── app
    │   ├── features
    │   ├── shared
    │   └── widgets
    └── .env.local.example
```

## Getting Started

Clone & start dev servers:

```bash
git clone https://github.com/Chifer123536/Todo.git
cd Todo
yarn install
yarn start
```

## Screenshots

![screenshot](https://raw.githubusercontent.com/Chifer123536/Todo/main/frontend/public/screenshots/screenshot.png)

## API Overview

```
POST    /auth/register
POST    /auth/login
POST    /auth/login/2fa
GET     /auth/verify?token=
POST    /auth/forgot-password
POST    /auth/reset-password

GET     /todos
POST    /todos
GET     /todos/:id
PUT     /todos/:id
DELETE  /todos/:id
```

## License

[MIT](https://opensource.org/licenses/MIT).
