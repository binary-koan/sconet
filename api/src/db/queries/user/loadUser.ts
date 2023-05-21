import { UserRecord } from "../../records/user"

export function loadUser(row: any): UserRecord {
  return {
    id: row.id,
    email: row.email,
    encryptedPassword: row.encryptedPassword,
    webauthnChallenge: row.webauthnChallenge,

    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
