import { UserCredentialRecord } from "../../records/userCredential"

export function loadUserCredential(row: any): UserCredentialRecord {
  return {
    id: row.id,
    userId: row.userId,
    device: row.device,
    credentialId: row.credentialId,
    credentialPublicKey: row.credentialPublicKey,
    counter: row.counter,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
