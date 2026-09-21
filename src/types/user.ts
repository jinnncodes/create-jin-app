export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

export type UserProfile = {
  id: string
  email: string | null
  displayName: string
  photoUrl: string | null
  createdAt: string
  updatedAt: string
}
