import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const functionsDir = path.join(root, 'cloud-functions')
const dataDir = path.join(root, 'data', 'firebase-emulator')
const projectId = process.env.FIREBASE_PROJECT_ID || 'demo-project'

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        FIREBASE_PROJECT_ID: projectId,
        GCLOUD_PROJECT: projectId,
        FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
        FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099',
        FIREBASE_STORAGE_EMULATOR_HOST: process.env.FIREBASE_STORAGE_EMULATOR_HOST || 'localhost:9199',
        ...extraEnv,
      },
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
      }
    })
  })
}

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

await run('pnpm', ['--dir', functionsDir, 'run', 'build'])

const emulatorArgs = [
  'emulators:start',
  '--only',
  'auth,firestore,functions,storage',
  '--project',
  projectId,
  `--import=${dataDir}`,
  `--export-on-exit=${dataDir}`,
]

await run('pnpm', ['exec', 'firebase', ...emulatorArgs])
