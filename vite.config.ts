import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const parseCliArgs = () => {
  const args = process.argv.slice(2)
  const getArg = (name: string) => {
    const index = args.indexOf(name)
    return index !== -1 ? args[index + 1] : undefined
  }

  return {
    port: getArg('--port') ? parseInt(getArg('--port')!, 10) : 5173,
    firebaseAuthPort: getArg('--firebase-auth-port'),
    firestorePort: getArg('--firestore-port'),
    storagePort: getArg('--storage-port'),
    functionsPort: getArg('--functions-port'),
    useFirebaseEmulator: getArg('--use-firebase-emulator'),
  }
}

export default defineConfig(() => {
  const cliArgs = parseCliArgs()
  const define: Record<string, string> = {}

  if (cliArgs.firebaseAuthPort !== undefined) {
    define['import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT'] = JSON.stringify(cliArgs.firebaseAuthPort)
  }
  if (cliArgs.firestorePort !== undefined) {
    define['import.meta.env.VITE_FIRESTORE_EMULATOR_PORT'] = JSON.stringify(cliArgs.firestorePort)
  }
  if (cliArgs.storagePort !== undefined) {
    define['import.meta.env.VITE_STORAGE_EMULATOR_PORT'] = JSON.stringify(cliArgs.storagePort)
  }
  if (cliArgs.functionsPort !== undefined) {
    define['import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT'] = JSON.stringify(cliArgs.functionsPort)
  }
  if (cliArgs.useFirebaseEmulator !== undefined) {
    define['import.meta.env.VITE_USE_FIREBASE_EMULATOR'] = JSON.stringify(cliArgs.useFirebaseEmulator)
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: cliArgs.port,
    },
    define,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
