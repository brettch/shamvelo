# AGENTS.md — Shamvelo

## Commands (run from `app/`)

| Command | Action |
|---------|--------|
| `npm run build` | `tsc` (src/ → dist/) |
| `npm start` | `node dist/index.js` on port 8080 |
| `npm run lint` | ESLint (type-checked) |
| `npm test` | Jest on `dist/` — requires `build` first |
| `npm run test:watch` | Jest watch mode |

Deploy: `gcloud run deploy shamvelo --source .` (run from `app/`). See README.md for full deploy steps.

Strava client codegen (rare): `strava:openapi` + `strava:generate`.

## Architecture

- **ESM** (`"type": "module"`) — all imports need `.js` extension in source.
- **Entrypoint**: `src/index.ts` → `src/server.ts` (Express + Handlebars).
- **Config**: `.env` loaded by `src/config.ts` via `dotenv`.
- **DB**: Firestore — always use `db/persist.ts` wrapper, never SDK directly. Batches capped at 100.
- **Strava auth**: tokens auto-refreshed on expiry mid-request.

## Codegen & artifacts

- `src/strava/` and `openapi/` — **generated, do not edit**.
- `dist/` — build output, contains stale sync-conflict\* files, ignore.
- `eslint.config.js` — type-checked linting (`recommendedTypeChecked`).

## Testing

- Tests are `.spec.ts` files alongside source. No jest.config.js.
- **Always run `npm run build` before `npm test`** — Jest reads from `dist/`.
- No sample data files committed (sample-data dirs are empty).

## Toolchain

- Node 24, gcloud, Java managed via Mise (`.mise.toml` at root).
- Runtime: Cloud Run (`Dockerfile`), `node:24-slim` base image.
