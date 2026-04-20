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
```

## Local services

```bash
cd "budget App"
docker compose -f docker-compose.dev.yml up
```
