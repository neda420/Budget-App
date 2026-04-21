# BudgetLens (Budget-App)

Repository bootstrap aligned with `budget App/spec_extracted.txt` (Phase 1 baseline).

## Structure

- `budget App/api`: NestJS API scaffold with versioned routes under `/api/v1`
- `budget App/api/src/domain`: framework-agnostic domain models
- `budget App/api/src/interface-adapters/rest`: REST controllers/modules (auth, receipts, categories, health)
- `budget App/docker-compose.dev.yml`: local Postgres, Redis, RabbitMQ, and API runtime

## API commands

```bash
cd "budget App/api"
npm ci
npm run lint
npm run test
npm run test:e2e
npm run build
npm run prisma:generate
npm run prisma:migrate:deploy
```

## Local services

```bash
cd "budget App"
docker compose -f docker-compose.dev.yml up
```

## Store release checklist (mobile + API)

- Add missing iOS native project once in `budget App/web`:
  - `npm run cap:add:ios`
- Regenerate Android/iOS app icons and splash assets from `budget App/web/resources`:
  - `npm run cap:assets`
- Configure release signing secrets in GitHub:
  - Android: `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEY_ALIAS`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`
  - iOS: `IOS_CERTIFICATE_P12_BASE64`, `IOS_CERTIFICATE_PASSWORD`, `IOS_PROVISIONING_PROFILE_BASE64`, `IOS_PROVISIONING_PROFILE_NAME`, `IOS_TEAM_ID`
- Set production frontend API URL for builds:
  - GitHub variable `API_URL` (used as `NEXT_PUBLIC_API_URL`).
