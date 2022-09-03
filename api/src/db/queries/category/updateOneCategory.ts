import { db } from "../../database"
import { assertFieldName } from "../../../utils/assertFieldName"
import { mapKeys, pickBy } from "lodash"
import { CategoryRecord } from "../../records/category"

export function updateOneCategory(id: string, fields: Partial<CategoryRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(`UPDATE categories SET ${set} WHERE id = $id`, {
    $id: id,
    ...mapKeys(fieldsToSet, (_, key) => `$${key}`)
  })

  return id
}
