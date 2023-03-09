export interface UserCredentialRecord {
  id: string
  userId: string
  device: string

  credentialId: Uint8Array
  credentialPublicKey: Uint8Array
  counter: number

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
