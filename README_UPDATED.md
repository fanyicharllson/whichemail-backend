# CharlseEmpire Tech — Backend

Express + TypeScript backend that exposes a small REST API backed by Prisma and PostgreSQL. It serves an Angular frontend by returning Software and Category records from a remote database.

This README explains purpose, how to run locally, and the important Prisma workflow so you can safely work with your remote DB without losing data.

---

## Tech stack

- Node.js + Express (TypeScript)
- Prisma ORM + PostgreSQL
- pnpm for package management

## Purpose / responsibilities

- Provide CRUD and read endpoints for Software and Category data consumed by an Angular UI.
- Keep a clear Prisma schema and migration history so deployments and local development stay in sync with the remote DB.

## Data model (high level)

- Software: id, name, slug, description, version, platform (array), price, imageUrl, downloadUrl, featured, categoryId, webUrl, tags, repoUrl, timestamps
- Category: id, name, slug, timestamps

## Quick start (developer)

1. Copy environment variables:

```powershell
cp .env.example .env
# then edit .env and set DATABASE_URL (remote DB connection)
```

2. Install dependencies:

```powershell
pnpm install
```

3. If working with a shared remote database: do NOT run destructive commands without a backup.

### Safe Prisma workflow when your remote DB already contains data (recommended):

- Pull the current schema locally (non-destructive):

```powershell
pnpm dlx prisma db pull
```

- Create a baseline migration locally (create-only):

```powershell
pnpm dlx prisma migrate dev --name baseline --create-only
```

- Mark that migration as applied (so Prisma and the DB agree):

```powershell
pnpm dlx prisma migrate resolve --applied <timestamp>_baseline
```

- Finally regenerate Prisma client:

```powershell
pnpm run prisma:generate
```

If you control and can safely reset the DB (dev only), you can run `pnpm exec prisma migrate reset --force` then `pnpm run seed` — but only after taking a backup.

## Run the dev server

```powershell
pnpm run dev
```

## Build and start (production)

```powershell
pnpm run build
pnpm start
```

## Environment variables

- `.env` must include DATABASE_URL. See `.env.example` for format.

## API endpoints (provided by this project)

- GET /api/software — list all software items (includes category)
- GET /api/software/:id — fetch a single software item by id

## Example response (list):

```json
[
  {
    "id": "cuid...",
    "name": "Phonkers",
    "slug": "phonkers",
    "description": "Discover, stream...",
    "platform": ["ios","android"],
    "price": 0,
    "category": { "id": "...", "name": "Music" }
  }
]
```

## Folder layout

```
prisma/                # Prisma schema, migrations, and seed
src/
  controllers/         # HTTP handlers
  routes/              # Express routes
  prisma/              # Prisma client wrapper (singleton)
  services/            # Business logic (optional)
  index.ts             # application entry
dist/                  # compiled JS (output)
```
