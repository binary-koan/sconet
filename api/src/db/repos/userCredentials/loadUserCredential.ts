import { UserCredentialRecord } from "../../records/userCredential"
import { loadDate } from "../../utils"

export function loadUserCredential(row: any): UserCredentialRecord {
  return {
    id: row.id,
    userId: row.userId,
    device: row.device,
    credentialId: row.credentialId,
    credentialPublicKey: row.credentialPublicKey,
    counter: row.counter,
    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
