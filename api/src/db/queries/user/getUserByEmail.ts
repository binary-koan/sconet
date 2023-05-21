import { sql } from "../../database"
import { UserRecord } from "../../records/user"

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`

  return result[0] as UserRecord
}
