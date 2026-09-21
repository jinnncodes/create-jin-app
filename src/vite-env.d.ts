/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_URL?: string
  readonly VITE_AUTH_MODE?: string
  readonly VITE_ALLOW_ANONYMOUS_USERS?: string
  readonly VITE_USE_FIREBASE_EMULATOR?: string
  readonly VITE_FIREBASE_AUTH_EMULATOR_PORT?: string
  readonly VITE_FIRESTORE_EMULATOR_PORT?: string
  readonly VITE_STORAGE_EMULATOR_PORT?: string
  readonly VITE_FUNCTIONS_EMULATOR_PORT?: string
  readonly VITE_FUNCTIONS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.json' {
  const value: unknown
  export default value
}
