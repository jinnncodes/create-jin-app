export function isLocalAuth(): boolean {
  if (import.meta.env.PROD) {
    return false
  }
  return import.meta.env.VITE_AUTH_MODE !== 'firebase'
}
