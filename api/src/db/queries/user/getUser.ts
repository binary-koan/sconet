import { db } from "../../database"
import { UserRecord } from "../../records/user"
import { loadUser } from "./loadUser"

export function getUser(id: string): UserRecord | undefined {
  const result = db.query("SELECT * FROM users WHERE id = ?").get(id)

  return result && loadUser(result)
}
