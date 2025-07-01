# Todo App

Full-stack task manager built with **Next.js**, **NestJS**, **TypeScript**, **MongoDB**, and **Redis**.

## Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [License](#license)

## Demo

Live demo available at:  
[https://todolist.chifer123536.ru/](https://todolist.chifer123536.ru/)

## Features

- User authentication: register, login, email verification, password reset
- 2FA and OAuth (Google & Yandex)
- CRUD for todos with pagination
- User profile & theme settings (light/dark)
- Email notifications via SMTP
- Custom animations and error messaging

## Tech Stack

| Layer      | Tech                            | Notes / Key points                            |
| ---------- | ------------------------------- | --------------------------------------------- |
| Frontend   | Next.js 15, React 19            | SSR, latest React, fast incremental rendering |
| Backend    | NestJS 11                       | Modular, scalable, TypeScript-based           |
| Database   | MongoDB + Mongoose              | Flexible schema, ODM                          |
| Cache      | Redis                           | Session storage, caching for performance      |
| Auth       | Sessions, 2FA, OAuth, ReCAPTCHA | Multi-layer secure auth                       |
| Email      | Nodemailer (SMTP)               | Reliable email notifications                  |
| Styles     | Tailwind CSS, SCSS Modules      | Utility-first + modular CSS                   |
| Forms      | React Hook Form + Zod           | Declarative forms with strong validation      |
| State      | React Query                     | Efficient data fetching & caching             |
| UI Kit     | Radix UI, Lucide Icons          | Accessible, customizable UI components        |
| Animations | Framer Motion                   | Smooth and interactive animations             |
| Testing    | Jest + React Testing Library    | Unit + integration tests                      |
| Dev Setup  | Yarn Workspaces (Monorepo)      | Unified dependency management & builds        |

---

**Why this project/stack?**  
Initially, this Todo app was planned just as a practice exercise to sharpen my skills.
But during development, I decided — why not build a fully-featured, production-ready app with an advanced tech stack?
That’s how this project was born

## Architecture

### Monorepo Setup

Single repository using Yarn Workspaces for both frontend and backend — simplifies dependency management, builds, and deployment.

### Backend Modularity

NestJS modules clearly separate concerns by domain: authentication, todos, user profiles. This improves maintainability and scalability.

### State Management

React Query handles server state caching, background updates, and synchronization — reducing boilerplate and enhancing UX.

### Secure Authentication

Multi-layered auth combining sessions, Two-Factor Authentication (2FA), OAuth (Google, Yandex), and ReCAPTCHA for security and user convenience.

### API-first Design

RESTful API with clear, logical, and predictable endpoints, enabling easy frontend integration and straightforward testing.

### Styling Approach

Combination of Tailwind CSS (utility-first) and SCSS Modules provides modular, maintainable, and performant styling.

### Form Validation

React Hook Form paired with Zod for declarative, strong validation and instant user feedback.

### Animations

Framer Motion adds smooth, responsive animations that enhance interface perception and user interaction.

### Testing

Jest and React Testing Library ensure robust unit and integration test coverage, guaranteeing stability and preventing regressions.

## Project Structure

```
/Todo
├── backend       # NestJS API: auth, todos, users
│   ├── src
│   │   ├── auth  # Auth modules: JWT, 2FA, OAuth, sessions
│   │   ├── todo  # Todo CRUD logic + pagination
│   │   └── user  # User profile and settings
│   └── .env.example
└── frontend      # Next.js 15 app with React 19 + Tailwind CSS
    ├── public/screenshots/
    ├── src
    │   ├── app       # Next.js app routes and layouts
    │   ├── features  # Domain features (auth, todos, profile)
    │   ├── shared    # Shared UI components, utils
    │   └── widgets   # UI widgets, animations, forms
    └── .env.example

```

## Screenshots

![screenshot](https://raw.githubusercontent.com/Chifer123536/Todo/master/frontend/public/screenshots/Screenshot.png)

## Lighthouse

The production build was audited using Chrome DevTools Lighthouse.

![lighthouse](https://raw.githubusercontent.com/Chifer123536/Todo/master/frontend/public/screenshots/Lighthouse_screenshot.png)

- **Performance**: 91
- **Accessibility**: 88
- **Best Practices**: 100
- **SEO**: 100

## API Overview

```
POST    /auth/register         — User registration
POST    /auth/login            — Login with password + 2FA (if enabled)
POST    /auth/login/2fa        — 2FA verification step
GET     /auth/verify?token=   — Email verification link
POST    /auth/forgot-password  — Request password reset
POST    /auth/reset-password   — Set new password

GET     /todos                 — Get paginated todos list
POST    /todos                 — Create new todo
GET     /todos/:id             — Get todo details
PUT     /todos/:id             — Update todo
DELETE  /todos/:id             — Delete todo

```

## License

[MIT](https://opensource.org/licenses/MIT) © Chifer123536
