# GitHub Drive

A minimal, glassmorphism cloud-drive UI that stores files in a GitHub repository.
Frontend: React + Vite + Tailwind + Framer Motion. Backend: Cloudflare Pages Functions.
Storage: GitHub REST API. Auth: JWT (HS256) + scrypt-js password hashing.

## Repo layout used as storage

```
USER/
  {username}/
    meta.json        # { username, passwordHash, createdAt }
    files/
      <your files>
```

## Required Cloudflare environment variables

Set these in **Cloudflare Pages → Settings → Environment variables**
(Production AND Preview). Mark `API` and `JWT_SECRET` as **Secrets**.

| Name         | Description                                                  |
|--------------|--------------------------------------------------------------|
| `API`        | GitHub Personal Access Token with `repo` scope (Secret)      |
| `GH_REPO`    | `meowmi0122/Github-Drive-Storage`                            |
| `GH_BRANCH`  | `main` (optional, defaults to `main`)                        |
| `JWT_SECRET` | Long random string for signing sessions (Secret)             |

> The GitHub token is **only** read inside `/functions/**` (server-side).
> It is never bundled into the frontend.

## Local development

```bash
npm install
npm run dev          # frontend on :5173
# In another terminal, to test functions locally:
npx wrangler pages dev dist --compatibility-date=2024-09-01
# (build first: npm run build)
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare Dashboard → Pages → Create project → Connect repo.
3. Build command: `npm run build` · Output directory: `dist`
4. Add the env vars above (set `API` and `JWT_SECRET` as Secrets).
5. Deploy.

Functions in `/functions/api/*` are auto-deployed as `/api/*`.

## API

| Endpoint        | Method | Auth   | Body / Headers                                             |
|-----------------|--------|--------|------------------------------------------------------------|
| `/api/register` | POST   | -      | JSON `{ username, password }`                              |
| `/api/login`    | POST   | -      | JSON `{ username, password }`                              |
| `/api/list`     | GET    | Bearer | -                                                          |
| `/api/upload`   | POST   | Bearer | Raw body, `X-Filename: <urlencoded>` header                |
| `/api/file`     | GET    | Bearer | Query `?name=<filename>`                                   |
| `/api/delete`   | POST   | Bearer | JSON `{ name, sha? }`                                      |

## Notes / limits

- GitHub Contents API limits files to ~100MB. The upload endpoint caps at ~95MB.
- Cloudflare Workers free plan limits request body size (~100MB on paid).
- Username chars: `a-z A-Z 0-9 _ -`, length 2–32.
- Password length: 6–128.
- All icons are inline SVG. No emoji, no external icon library.
