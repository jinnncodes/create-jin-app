import localAuthFile from '@/data/local-auth.json'
import type { AuthUser } from '@/types/user'
import type { LocalAuthConfig } from '@/types/local-auth'

const SESSION_KEY = 'create-jin-app.local-session'

export const localAuthConfig = localAuthFile as LocalAuthConfig

function uidFromEmail(email: string): string {
  return `local-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function getLocalSession(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function signInLocal(email: string, password: string): AuthUser {
  const trimmedEmail = email.trim().toLowerCase()

  if (!trimmedEmail) {
    throw new Error('Email is required')
  }

  if (password !== localAuthConfig.defaultPassword) {
    throw new Error(`Invalid password. Use "${localAuthConfig.defaultPassword}".`)
  }

  const knownUser = localAuthConfig.users.find(
    (user) => user.email.toLowerCase() === trimmedEmail
  )

  if (!localAuthConfig.acceptAnyEmail && !knownUser) {
    throw new Error('That email is not in src/data/local-auth.json')
  }

  const user: AuthUser = {
    uid: uidFromEmail(trimmedEmail),
    email: trimmedEmail,
    displayName: knownUser?.displayName ?? trimmedEmail.split('@')[0] ?? trimmedEmail,
    photoURL: null,
    isAnonymous: false,
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function signOutLocal() {
  window.localStorage.removeItem(SESSION_KEY)
}
