import { db } from "../../database"
import { assertFieldName } from "../../../utils/assertFieldName"
import { filter, mapKeys } from "lodash"
import { UserRecord } from "../../records/user"

export function updateOneUser(id: string, fields: Partial<UserRecord>) {
  const fieldsToSet = filter(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(
    `UPDATE users SET ${set} WHERE id = $id`,
    mapKeys(fieldsToSet, (key) => `$${key}`)
  )

  return id
}
