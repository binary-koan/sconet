import { UserRecord } from "../../records/user"
import { loadDate } from "../../utils"

export function loadUser(row: any): UserRecord {
  return {
    id: row.id,
    email: row.email,
    encryptedPassword: row.encryptedPassword,
    webauthnChallenge: row.webauthnChallenge,

    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
