import { db } from "../database"
import { assertFieldName } from "../../utils/assertFieldName"
import { filter, mapKeys } from "lodash"
import { CategoryRecord } from "../category"

export function updateOneCategory(id: string, fields: Partial<CategoryRecord>) {
  const fieldsToSet = filter(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(
    `UPDATE categories SET ${set} WHERE id = $id`,
    mapKeys(fieldsToSet, (key) => `$${key}`)
  )

  return id
}
