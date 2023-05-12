import { mapKeys, pickBy } from "lodash"
import { db } from "../../database"
import { UserRecord } from "../../records/user"
import { assertFieldName } from "../../utils/assertFieldName"

export function updateOneUser(id: string, fields: Partial<UserRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.query(`UPDATE users SET ${set} WHERE id = $id`).run({
    $id: id,
    ...mapKeys(fieldsToSet, (_, key) => `$${key}`)
  })

  return id
}
