# Planning Poker

![CI](https://github.com/philipphermes/planning-poker/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/philipphermes/planning-poker/graph/badge.svg?token=0ZFACR5SCX)](https://codecov.io/gh/philipphermes/planning-poker)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Getting Started

### Install required packages:

```bash
npm install
```

### create a .env from .env.dist and adjust credentials

```bash
cp .env.dist .env
```

#### Environment Variables

| Name                        | Description                                                          | Required | Default               |
|-----------------------------|----------------------------------------------------------------------|----------|-----------------------|
| NEXTAUTH_SECRET             | The Secret for Auth                                                  | True     | secret123!            |
| NEXTAUTH_URL                | The url used for callbacks                                           | True     | http://localhost:3000 |
| NEXTAUTH_SESSION_MAX_AGE    | Session & JWT max age in seconds                                     | False    | 3600/1h               |
| NEXTAUTH_SESSION_UPDATE_AGE | Session update age in seconds                                        | False    | 1800/30m              |
| NEXTAUTH_EMAIL_MAX_AGE      | Magic Link email max age in seconds                                  | False    | 1800/30m              |
| NEXTAUTH_ALLOWED_DOMAINS    | Allowed domains for emails seperated by ","                          | False    | test.com,example.com  |
| EMAIL_SERVER_USER           | Email Server username                                                | False    | username              |
| EMAIL_SERVER_PASSWORD       | Email Server password                                                | False    | password              |
| EMAIL_SERVER_HOST           | Host of the Email Server                                             | True     | smtp.example.com      |
| EMAIL_SERVER_PORT           | Port of the Email Server                                             | True     | 587                   |
| EMAIL_FROM                  | The Sender of emails                                                 | True     | noreply@example.com   |
| DB_URL                      | The path to the sqlite db file                                       | True     | file:local.db         |
| NODE_ENV                    | The projects environment (development or production)                 | True     | development           |
| HOSTNAME                    | Hostname                                                             | False    | localhost             |
| PORT                        | Port                                                                 | False    | 3000                  |
| UPLOAD_DIR                  | Directory for uploads                                                | True     | public/uploads        |
| NEXTAUTH_SECURE_COOKIES     | If it should use secure cookies, if not set checks if its production | False    |                       |

### Create sqlite DB

```bash
 npx drizzle-kit push
```

### run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Run build

This will build the client and the custom server.
We used esbuild to build the custom typescript server to commonjs.
A custom server was needed since we are using websocket for the estimation part.

> [!CAUTION]
> Change NODE_ENV to production

```bash
npm run build
```

### Start server

```bash
npm run start
```

### Run migrations

```bash
npm run migrate:prod
```

## Testing

### Run tests in watch mode

```bash
npm test
```

### Run tests once

```bash
npm run test:run
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run tests with Vitest UI

```bash
npm run test:ui
```
