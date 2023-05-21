import { UserCredentialRecord } from "../../records/userCredential"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeUserCredential(credential: Partial<UserCredentialRecord>) {
  return serializePartialRecord(credential)
}
