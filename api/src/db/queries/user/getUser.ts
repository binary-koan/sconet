import { sql } from "../../database"
import { UserRecord } from "../../records/user"

export async function getUser(id: string): Promise<UserRecord | undefined> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`

  return result[0] as UserRecord
}
