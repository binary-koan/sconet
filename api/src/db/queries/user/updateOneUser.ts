import { pickBy } from "lodash"
import { sql } from "../../database"
import { UserRecord } from "../../records/user"

export async function updateOneUser(id: string, fields: Partial<UserRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)

  await sql`UPDATE users SET ${sql(fieldsToSet)} WHERE id = ${id}`

  return id
}
