import type { AuthUser, UserProfile } from '@/types/user'
import { isLocalAuth } from '@/lib/auth-mode'

const LOCAL_PROFILE_KEY = 'create-jin-app.local-profile'
const USERS_COLLECTION = 'users'

function nowIso() {
  return new Date().toISOString()
}

function toIso(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  return fallback
}

function mapUserProfile(id: string, data: Record<string, unknown>): UserProfile {
  const timestamp = nowIso()
  return {
    id,
    email: typeof data.email === 'string' ? data.email : null,
    displayName: typeof data.displayName === 'string' ? data.displayName : '',
    photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl : null,
    createdAt: toIso(data.createdAt, timestamp),
    updatedAt: toIso(data.updatedAt, timestamp),
  }
}

function profileFromUser(user: AuthUser, existing?: UserProfile | null): UserProfile {
  const timestamp = nowIso()
  return {
    id: user.uid,
    email: user.email,
    displayName: existing?.displayName || user.displayName || '',
    photoUrl: user.photoURL,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

function readLocalProfile(uid: string): UserProfile | null {
  if (typeof window === 'undefined') {
    return null
  }
  const raw = window.localStorage.getItem(`${LOCAL_PROFILE_KEY}:${uid}`)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return null
  }
}

function writeLocalProfile(profile: UserProfile) {
  window.localStorage.setItem(`${LOCAL_PROFILE_KEY}:${profile.id}`, JSON.stringify(profile))
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (isLocalAuth()) {
    return readLocalProfile(uid)
  }

  const { doc, getDoc } = await import('firebase/firestore')
  const { db } = await import('@/lib/firebase')
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid))
  if (!snapshot.exists()) {
    return null
  }
  return mapUserProfile(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function upsertUserProfile(user: AuthUser): Promise<UserProfile> {
  if (isLocalAuth()) {
    const profile = profileFromUser(user, readLocalProfile(user.uid))
    writeLocalProfile(profile)
    return profile
  }

  const { doc, getDoc, serverTimestamp, setDoc, updateDoc } = await import('firebase/firestore')
  const { db } = await import('@/lib/firebase')
  const ref = doc(db, USERS_COLLECTION, user.uid)
  const snapshot = await getDoc(ref)
  const timestamp = nowIso()

  if (!snapshot.exists()) {
    const profile = profileFromUser(user)
    await setDoc(ref, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return profile
  }

  const existing = mapUserProfile(snapshot.id, snapshot.data() as Record<string, unknown>)
  const nextDisplayName = existing.displayName || user.displayName || ''
  await updateDoc(ref, {
    email: user.email,
    photoUrl: user.photoURL,
    displayName: nextDisplayName,
    updatedAt: serverTimestamp(),
  })

  return {
    ...existing,
    email: user.email,
    photoUrl: user.photoURL,
    displayName: nextDisplayName,
    updatedAt: timestamp,
  }
}

export async function updateUserProfile(
  uid: string,
  patch: Pick<UserProfile, 'displayName'>
): Promise<void> {
  if (isLocalAuth()) {
    const existing = readLocalProfile(uid)
    if (!existing) {
      throw new Error('No local profile to update')
    }
    writeLocalProfile({
      ...existing,
      displayName: patch.displayName,
      updatedAt: nowIso(),
    })
    return
  }

  const { doc, serverTimestamp, updateDoc } = await import('firebase/firestore')
  const { db } = await import('@/lib/firebase')
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    displayName: patch.displayName,
    updatedAt: serverTimestamp(),
  })
}
