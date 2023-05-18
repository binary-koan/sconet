import { sql } from "../../database"
import { UserRecord } from "../../records/user"
import { loadUser } from "./loadUser"

export async function getUser(id: string): Promise<UserRecord | undefined> {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`

  return result ? loadUser(result) : undefined
}
