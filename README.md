# create-jin-app

Reusable React starter kit with a login page, dashboard, and optional Firebase backend.

## Use this as your starter

After this repo is on GitHub, turn it into a template:

1. GitHub repo **Settings** → check **Template repository**
2. On the repo home page, click **Use this template** → **Create a new repository**

Or clone it:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/create-jin-app.git my-app
cd my-app
pnpm install
pnpm dev
```

Open http://localhost:5173. Sign in with any email and password `Password`.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Auth:** Firebase Authentication
- **Data:** Cloud Firestore
- **Files:** Firebase Storage
- **Backend:** Firebase Cloud Functions (Node.js, Firebase Admin SDK)

## Development

Without a database, run the UI with local JSON login:

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. Sign in with **any email** and password **Password**.

This uses `src/data/local-auth.json` and does not start Firebase or Firestore.

When you are ready for Firebase:

```bash
# File: .env.local
# Variable: VITE_AUTH_MODE
# Purpose: set to firebase
pnpm dev:firebase
```

```bash
pnpm ui              # Frontend only
pnpm emulators       # Firebase emulators + Cloud Functions build
pnpm seed            # Seed Firestore emulator from seed/app-seed.json
pnpm seed:prod       # Seed live Firestore (requires ALLOW_PRODUCTION_SEED=true)
pnpm build           # Production frontend build
pnpm typecheck       # TypeScript (frontend + functions)
pnpm lint            # ESLint
```

`pnpm seed` requires the emulators to be running.

To seed a live Firebase project, set `ALLOW_PRODUCTION_SEED=true` and `FIREBASE_PROJECT_ID` to the real project, then run `pnpm seed:prod`. Do this only when you intend to write production data.

## Project structure

```text
src/                      # React frontend
├── components/           # App components + shadcn/ui
├── pages/
├── routes/               # Create role files from app requirements
├── hooks/
├── lib/                  # firebase, seo, auth, utils
├── services/             # Firestore / callable access
├── types/
├── App.tsx
└── main.tsx
public/                   # fonts, assets, icons, images, robots, sitemap
cloud-functions/src/      # Cloud Functions source
seed/app-seed.json
scripts/start-emulators-functions.mjs
docs/features/            # Local feature docs; do not commit
```

## Firebase web config

`src/lib/firebase-config.json` is generated from `src/lib/firebase-config.template.json` on first `pnpm dev` / `pnpm build`. Replace the placeholders with your Firebase web app config before using a real project.

Local emulator usage does not require production keys. `.firebaserc` defaults to `demo-project`.

## Environment

Copy `.env.example` to `.env.local` for the frontend. For local JSON login, keep `VITE_AUTH_MODE=local`. Switch to `firebase` when you add Auth and Firestore.

Never commit secrets. Emulator seed is the default. Production seed requires an explicit `pnpm seed:prod` with `ALLOW_PRODUCTION_SEED=true`.

## UI components

```bash
npx shadcn@latest add [component]
```

## Routing

Default screens:

- `/login` — sign in / register (shadcn)
- `/dashboard` — signed-in home (shadcn)
- `/settings` — profile

Do not hardcode Patient, Clinic, Admin, or other domain roles in this starter. Derive user types from the product requirements and add matching files under `src/routes/`.
