import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedPath = path.join(root, 'seed', 'app-seed.json')
const production = process.argv.includes('--production')

function resolveTarget() {
  const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'demo-project'
  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST

  if (production) {
    if (emulatorHost) {
      throw new Error(
        'Refusing production seed: FIRESTORE_EMULATOR_HOST is set. Unset it so Admin SDK targets the live project.'
      )
    }
    if (process.env.ALLOW_PRODUCTION_SEED !== 'true') {
      throw new Error(
        'Refusing production seed: set ALLOW_PRODUCTION_SEED=true in the environment used to run this command.'
      )
    }
    if (!projectId || projectId === 'demo-project') {
      throw new Error(
        'Refusing production seed: set FIREBASE_PROJECT_ID (or GCLOUD_PROJECT) to the real Firebase project.'
      )
    }
    return { mode: 'production', projectId, emulatorHost: null }
  }

  if (!emulatorHost) {
    throw new Error(
      'Refusing to seed: FIRESTORE_EMULATOR_HOST is not set. Start emulators first, then run pnpm seed. To seed production, the human must explicitly request it and run pnpm seed:prod.'
    )
  }

  return { mode: 'emulator', projectId, emulatorHost }
}

const target = resolveTarget()
const seed = JSON.parse(await readFile(seedPath, 'utf8'))

initializeApp({ projectId: target.projectId })
const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })

if (target.mode === 'production') {
  console.warn(`Seeding PRODUCTION Firestore project ${target.projectId}`)
}

const firestoreSeed = seed.firestore ?? {}
let written = 0

for (const [collectionName, documents] of Object.entries(firestoreSeed)) {
  for (const [documentId, data] of Object.entries(documents)) {
    await db.doc(`${collectionName}/${documentId}`).set(data, { merge: true })
    written += 1
    console.log(`Seeded ${collectionName}/${documentId}`)
  }
}

const destination =
  target.mode === 'production'
    ? `production project ${target.projectId}`
    : `emulator ${target.emulatorHost}`

console.log(`Seed complete (${written} documents) against ${destination}`)
