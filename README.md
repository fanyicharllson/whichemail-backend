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

## Docker (build and push)

This project includes a multi-stage Dockerfile optimized for building the TypeScript app and producing a small runtime image.

Build locally (tag with your DockerHub username/repo):

```powershell
docker build -t <your-docker-username>/charlseempire-backend:latest .
```

Run locally:

```powershell
docker run --env-file .env -p 3000:3000 <your-docker-username>/charlseempire-backend:latest
```

Push to Docker Hub (example):

```powershell
docker login
docker tag <your-docker-username>/charlseempire-backend:latest <your-docker-username>/charlseempire-backend:1.0.0
docker push <your-docker-username>/charlseempire-backend:1.0.0
```

Notes on building for production:
- Make sure `.env` is NOT included in the image. Use secrets or your hosting provider environment variables for production.
- If your database is remote, pass the DATABASE_URL when running the container or use your cloud provider secret manager.

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

## Notes & next steps

- Add validation (zod/Joi) and input sanitization for write endpoints.
- Add authentication and authorization for admin/write routes.
- Configure CI/CD and a safe migration deployment strategy for production.

If you want, I can update this README further with deployment instructions for a specific provider (Render, Fly, Railway, Vercel, etc.) or add example Postman/HTTP collections.
# CharlseEmpire Tech Backend (Express + TypeScript + Prisma)

This repository is a small Express + TypeScript backend that uses Prisma to talk to your database and expose a simple REST API consumed by an Angular frontend.

Quick steps to get started (local development):

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.

2. Install dependencies with pnpm:

```powershell
pnpm install
```

3. Generate Prisma client and run migrations (create DB schema):

```powershell
pnpm run prisma:generate
pnpm run prisma:migrate
```

If you want to seed example data:

```powershell
pnpm run seed
```

4. Start dev server:

```powershell
pnpm run dev
```

The API endpoints:
- GET /api/software — list software with category
- GET /api/software/:id — fetch a single software item

Folder structure (production-ready suggestion):

```
prisma/                # Prisma schema & seed
src/
  controllers/         # Controllers (HTTP handlers)
  routes/              # Express route definitions
  prisma/              # Prisma client wrapper
  services/            # Business logic (optional)
  utils/               # small helpers (pagination, validation)
  index.ts             # app entry
dist/                  # compiled JS (output)
```

Notes & next steps:
- Add authentication (JWT) and role checks for write endpoints.
- Add validation (zod or Joi) for payloads.
- Add pagination & filtering for list endpoints.
- Configure CI/CD and deploy with Docker or to a PaaS (e.g., Render, Railway, Fly, Azure).
