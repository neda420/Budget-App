# BudgetLens

**BudgetLens** is a full-stack personal finance app that lets users photograph receipts, automatically extract spending data via OCR, and track expenses across categories — available as a web app and native mobile app (Android & iOS via Capacitor).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development (Docker)](#local-development-docker)
  - [Running Services Individually](#running-services-individually)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Mobile Builds](#mobile-builds)
- [CI/CD Pipeline](#cicd-pipeline)
- [Store Release Checklist](#store-release-checklist)

---

## Features

- 📷 **Receipt upload** — photograph or upload receipt images
- 🤖 **OCR processing** — automated extraction of merchant, total, tax, line items, and currency
- 📊 **Dashboard** — spending overview with category breakdowns
- 🗂️ **Expense categories** — create and manage custom categories
- 🔐 **JWT authentication** — secure register / login / token refresh
- 📱 **Mobile app** — same codebase deployed as Android and iOS native apps via Capacitor
- 💳 **Subscription tiers** — FREE, PRO, and ENTERPRISE with configurable monthly quotas

---

## Tech Stack

| Layer | Technology |
|---|---|
| API | [NestJS](https://nestjs.com/) (Node 20, TypeScript) |
| Database | PostgreSQL 15 + [Prisma ORM](https://www.prisma.io/) |
| Cache / Queue | Redis 7 · RabbitMQ 3.12 |
| Web frontend | [Next.js 14](https://nextjs.org/) (App Router, static export) |
| Mobile | [Capacitor](https://capacitorjs.com/) — wraps the Next.js static export |
| Styling | Tailwind CSS |
| Auth | JWT (access + refresh tokens) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
Budget-App/
└── budget App/
    ├── api/                        # NestJS REST API (port 3000)
    │   ├── prisma/
    │   │   ├── schema.prisma       # Database models
    │   │   └── migrations/
    │   ├── src/
    │   │   ├── domain/             # Framework-agnostic domain models
    │   │   ├── infrastructure/
    │   │   │   ├── auth/           # JWT strategy, auth service
    │   │   │   └── prisma/         # PrismaService
    │   │   └── interface-adapters/rest/
    │   │       ├── auth/           # POST /auth/register, /login, /refresh
    │   │       ├── receipts/       # CRUD + status for receipts
    │   │       ├── categories/     # Expense category management
    │   │       └── health/         # GET /health
    │   └── test/                   # Unit & e2e tests
    ├── web/                        # Next.js web + Capacitor mobile (port 3001)
    │   ├── src/app/
    │   │   ├── (auth)/             # Login, Register pages
    │   │   ├── (app)/              # Authenticated: Dashboard, Receipts, Upload
    │   │   ├── privacy/            # Privacy policy
    │   │   └── terms/              # Terms of service
    │   ├── android/                # Android native project
    │   ├── ios/                    # iOS native project
    │   ├── resources/              # Source icons & splash images
    │   └── capacitor.config.ts     # Capacitor configuration (appId: com.budgetlens.app)
    ├── .github/workflows/main.yml  # CI/CD pipeline
    └── docker-compose.dev.yml      # Local dev stack
```

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & Docker Compose

### Local Development (Docker)

The fastest way to run everything locally — API, web frontend, Postgres, Redis, and RabbitMQ all start together:

```bash
cd "budget App"
docker compose -f docker-compose.dev.yml up
```

| Service | URL |
|---|---|
| Web frontend | http://localhost:3001 |
| API | http://localhost:3000 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
| RabbitMQ management | http://localhost:15672 |

### Running Services Individually

**API**

```bash
cd "budget App/api"
npm ci
npm run prisma:generate       # generate Prisma client
npm run prisma:migrate:deploy # apply DB migrations
npm run start:dev             # starts on port 3000 with watch mode
```

**Web**

```bash
cd "budget App/web"
npm ci
npm run dev                   # starts Next.js on port 3001
```

**Run API checks**

```bash
cd "budget App/api"
npm run lint
npm run test
npm run test:e2e
npm run build
```

---

## Environment Variables

### API (`budget App/api/.env`)

| Variable | Description | Default (dev) |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/budgetlens` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `RABBITMQ_URL` | RabbitMQ connection string | `amqp://localhost:5672` |
| `JWT_SECRET` | Secret used to sign access tokens | *(required)* |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens | *(required)* |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3001` |

### Web (`budget App/web/.env.local`)

| Variable | Description | Default (dev) |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the BudgetLens API (no trailing slash) | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | App display name shown in the browser | `BudgetLens` |

Copy the example file to get started:

```bash
cp "budget App/web/.env.example" "budget App/web/.env.local"
```

---

## API Reference

All routes are prefixed with `/api/v1`.

### Auth — `/api/v1/auth`

| Method | Path | Description |
|---|---|---|
| `POST` | `/register` | Create a new user account |
| `POST` | `/login` | Authenticate and receive JWT tokens |
| `POST` | `/refresh` | Exchange a refresh token for a new access token |

### Receipts — `/api/v1/receipts` *(requires JWT)*

| Method | Path | Description |
|---|---|---|
| `POST` | `/` | Upload a new receipt image |
| `GET` | `/` | List all receipts for the authenticated user |
| `GET` | `/:id` | Get a single receipt with extracted data and line items |
| `DELETE` | `/:id` | Delete a receipt |
| `GET` | `/:id/status` | Poll the OCR processing status |

### Categories — `/api/v1/categories` *(requires JWT)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | List all expense categories |
| `POST` | `/` | Create a new expense category |

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness probe — returns service status |

---

## Database Schema

Key models in `budget App/api/prisma/schema.prisma`:

| Model | Purpose |
|---|---|
| `User` | Account with subscription level (FREE / PRO / ENTERPRISE) and monthly quota |
| `Receipt` | Uploaded receipt with OCR-extracted fields (merchant, total, tax, currency, date) |
| `LineItem` | Individual line items extracted from a receipt |
| `ExpenseCategory` | User-defined spending categories |
| `Session` | Refresh token sessions |

Receipt processing states: `UPLOADED → OCR_PENDING → OCR_PROCESSING → COMPLETED / FAILED`

---

## Mobile Builds

BudgetLens uses [Capacitor](https://capacitorjs.com/) to wrap the Next.js static export into native Android and iOS apps. The bundle ID is `com.budgetlens.app`.

**Build for Android**

```bash
cd "budget App/web"
npm run cap:build:android   # next build + cap sync android
npm run cap:android         # open in Android Studio
```

**Build for iOS**

```bash
cd "budget App/web"
npm run cap:build:ios       # next build + cap sync ios
npm run cap:ios             # open in Xcode
```

**Regenerate app icons and splash screens**

Place source assets in `budget App/web/resources/` first (see `resources/README.md`), then:

```bash
cd "budget App/web"
npm run cap:assets
```

Required source files:
- `resources/icon-only.png` (512×512 PNG)
- `resources/icon-foreground.png` (512×512 PNG)
- `resources/icon-background.png` (512×512 PNG)
- `resources/splash.png` (2732×2732 PNG)

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/main.yml`) runs on every push and pull request:

| Job | What it does |
|---|---|
| `api-lint` | ESLint on all API TypeScript sources |
| `api-test` | Jest unit tests |
| `api-build` | NestJS production build |
| `web-lint` | ESLint via Next.js |
| `web-build` | Next.js static export (`out/`) |
| `android-build` | Capacitor sync + Gradle release AAB (signed when secrets are set) |
| `ios-build` | Capacitor sync + Xcode signed IPA (runs on `macos-latest`) |

The web build injects `NEXT_PUBLIC_API_URL` from the GitHub repository variable `API_URL` (falls back to `http://localhost:3000` if unset).

---

## Store Release Checklist

Before publishing to the Google Play Store or Apple App Store:

**GitHub Secrets — Android signing**

| Secret | Description |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded `.jks` keystore |
| `ANDROID_KEY_ALIAS` | Key alias inside the keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_PASSWORD` | Key password |

**GitHub Secrets — iOS signing**

| Secret | Description |
|---|---|
| `IOS_CERTIFICATE_P12_BASE64` | Base64-encoded `.p12` distribution certificate |
| `IOS_CERTIFICATE_PASSWORD` | Certificate password |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded `.mobileprovision` file |
| `IOS_PROVISIONING_PROFILE_NAME` | Provisioning profile name |
| `IOS_TEAM_ID` | Apple Developer Team ID |

**GitHub Variable — production API**

| Variable | Description |
|---|---|
| `API_URL` | Production API base URL injected as `NEXT_PUBLIC_API_URL` during the web build |

**First-time iOS setup** — if the `ios/` native project has not been added yet:

```bash
cd "budget App/web"
npm run cap:add:ios
```
