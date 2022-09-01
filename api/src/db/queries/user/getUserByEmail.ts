import { db } from "../database"
import { UserRecord } from "../user"
import { loadUser } from "./loadUser"

export function getUserByEmail(email: string): UserRecord | undefined {
  const result = db.query("SELECT * FROM users WHERE email = ?").get(email)

  return result && loadUser(result)
}
