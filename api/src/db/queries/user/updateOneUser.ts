import { db } from "../../database"
import { assertFieldName } from "../../../utils/assertFieldName"
import { mapKeys, pickBy } from "lodash"
import { UserRecord } from "../../records/user"

export function updateOneUser(id: string, fields: Partial<UserRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(`UPDATE users SET ${set} WHERE id = $id`, {
    $id: id,
    ...mapKeys(fieldsToSet, (_, key) => `$${key}`)
  })

  return id
}
