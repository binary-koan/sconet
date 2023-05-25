export interface UserSettings {
  defaultCurrencyCode: string
  favoriteCurrencyCodes: string[]
  defaultAccountId?: string | null
}

export interface UserRecord {
  id: string
  email: string
  encryptedPassword: string
  webauthnChallenge: string | null
  settings: UserSettings

  createdAt: Date
  updatedAt: Date
}
