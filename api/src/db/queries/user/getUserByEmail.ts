import { sql } from "../../database"
import { UserRecord } from "../../records/user"
import { loadUser } from "./loadUser"

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`

  return result ? loadUser(result) : undefined
}
