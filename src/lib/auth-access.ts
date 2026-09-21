import type { AuthUser } from '@/types/user'

export function hasAppAccess(user: AuthUser | null): boolean {
  if (!user) {
    return false
  }

  const allowAnonymous = import.meta.env.VITE_ALLOW_ANONYMOUS_USERS !== 'false'
  if (allowAnonymous) {
    return true
  }

  return !user.isAnonymous
}

export function isFullySignedIn(user: AuthUser | null): boolean {
  return Boolean(user && !user.isAnonymous)
}
