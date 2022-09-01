import { UserRecord } from "../user"

export function loadUser(row: any): UserRecord {
  return {
    id: row.id,
    email: row.email,
    encryptedPassword: row.encryptedPassword,

    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}
