export type LocalAuthUserRecord = {
  email: string
  displayName?: string
}

export type LocalAuthConfig = {
  defaultPassword: string
  acceptAnyEmail: boolean
  users: LocalAuthUserRecord[]
}
