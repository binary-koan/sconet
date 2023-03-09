import { UserCredentialRecord } from "../../records/userCredential"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeUserCredential(credential: Partial<UserCredentialRecord>) {
  return serializePartialRecord(credential, {
    deletedAt: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
