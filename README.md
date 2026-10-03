# React + Bun Full-Stack Starter

A lean full-stack starter using Bun workspaces, React, Vite, Hono and Zod.

## Stack

- **Runtime / package manager / tests:** Bun 1.4+
- **Frontend:** React 19 + Vite 8 + SWC
- **Backend:** Hono on Bun
- **Validation:** Zod shared between frontend and backend
- **Tooling:** TypeScript strict mode + Biome
- **Production:** one Bun process can serve both the API and built SPA

## Security defaults

- Hono secure headers, including CSP
- Explicit CORS origin instead of `*`
- 1 MiB API body limit
- Request IDs generated server-side
- Generic 500 responses; server details are not exposed
- Strict runtime environment validation
- No credentials enabled in CORS by default
- No `dangerouslySetInnerHTML`
- Static hashed assets use immutable caching
- Dependency lifecycle scripts are not implicitly trusted by Bun
- Secrets are excluded from Git by default

This is a starter, not an authentication or authorization implementation. Add identity, authorization,
CSRF protection, distributed rate limiting, database controls, audit logging and observability according
to the application's threat model.

## Quick start

```bash
cp .env.example .env
bun install
bun run dev
```

Open `http://localhost:5173`.

- Web: `http://localhost:5173`
- API: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

Vite proxies `/api` to the Bun API during development.

## Production

```bash
bun install --frozen-lockfile
bun run check
bun run build
NODE_ENV=production bun run start
```

Open `http://localhost:3000`. In production the Hono server serves `apps/web/dist`.

## Useful commands

```bash
bun run dev
bun run check
bun run build
bun run start
bun run lint:fix
bun run format
```

## Project layout

```text
apps/
  api/       Bun + Hono API
  web/       React + Vite SPA
packages/
  shared/    Shared Zod schemas and types
```

## Rate limiting

Do distributed rate limiting at the ingress / reverse proxy or with a shared store. An in-memory limiter
inside one Bun process is intentionally not included because it produces incorrect limits once the app
runs on more than one instance.

## Reverse proxy

In production, terminate TLS at a hardened reverse proxy/load balancer, forward only expected headers,
enforce request/time limits, and keep `WEB_ORIGIN` set to the actual public web origin.
