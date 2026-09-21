# Port Handling

## Default local ports

| Service | Port | Purpose |
| --- | --- | --- |
| Frontend (Vite) | 5173 | React development server |
| Functions emulator | 5001 | Cloud Functions |
| Firestore emulator | 8080 | Firestore |
| Auth emulator | 9099 | Firebase Authentication |
| Storage emulator | 9199 | Cloud Storage |
| Emulator UI | 4000 | Firebase Emulator Suite UI |

These are the Firebase emulator defaults plus Vite's default port. Override them with environment variables from `.env.example` or Vite CLI flags:

```bash
pnpm ui -- --port 5173 --use-firebase-emulator true --firebase-auth-port 9099 --firestore-port 8080 --storage-port 9199 --functions-port 5001
```

## How local dev starts

`pnpm dev` runs:

1. `scripts/ensure-firebase-config.mjs` — creates `src/lib/firebase-config.json` from the template if missing
2. `scripts/start-emulators-functions.mjs` — builds `cloud-functions` and starts Auth, Firestore, Storage, and Functions emulators
3. Vite — frontend with `VITE_USE_FIREBASE_EMULATOR=true`

Emulator data is imported from and exported to `./data/firebase-emulator` (gitignored).

## Seed data

`pnpm seed` writes `seed/app-seed.json` into the **Firestore emulator**. It exits if `FIRESTORE_EMULATOR_HOST` is not set.

`pnpm seed:prod` writes the same seed to a live project. It requires `ALLOW_PRODUCTION_SEED=true`, a real `FIREBASE_PROJECT_ID`, and no `FIRESTORE_EMULATOR_HOST`.

## Production

Do not point the Vite app at emulators in production. Set `VITE_USE_FIREBASE_EMULATOR=false` (or omit it) and use a real `src/lib/firebase-config.json`.
