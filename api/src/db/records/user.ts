export interface UserRecord {
  id: string
  email: string
  encryptedPassword: string
  webauthnChallenge: string | null
  settings: {
    defaultCurrencyCode: string
    favoriteCurrencyCodes: string[]
    defaultAccountId: string | null
  }

  createdAt: Date
  updatedAt: Date
}
