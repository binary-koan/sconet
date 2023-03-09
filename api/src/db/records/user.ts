export interface UserRecord {
  id: string
  email: string
  encryptedPassword: string
  webauthnChallenge: string | null

  createdAt: Date
  updatedAt: Date
}
