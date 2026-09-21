import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import rawFirebaseConfig from './firebase-config.json'

const firebaseConfig = rawFirebaseConfig as {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)
export const googleProvider = new GoogleAuthProvider()

if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    const authPort = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || '9099'
    const firestorePort = import.meta.env.VITE_FIRESTORE_EMULATOR_PORT || '8080'
    const storagePort = import.meta.env.VITE_STORAGE_EMULATOR_PORT || '9199'
    const functionsPort = import.meta.env.VITE_FUNCTIONS_EMULATOR_PORT || '5001'

    connectAuthEmulator(auth, `http://localhost:${authPort}`, { disableWarnings: true })
    connectFirestoreEmulator(db, 'localhost', Number(firestorePort))
    connectStorageEmulator(storage, 'localhost', Number(storagePort))
    connectFunctionsEmulator(functions, 'localhost', Number(functionsPort))

    console.log('Connected to Firebase emulators', {
      auth: authPort,
      firestore: firestorePort,
      storage: storagePort,
      functions: functionsPort,
    })
  } catch (error) {
    console.debug('Firebase emulator connection skipped:', error)
  }
}
