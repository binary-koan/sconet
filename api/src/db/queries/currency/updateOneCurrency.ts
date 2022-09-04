import { db } from "../../database"
import { assertFieldName } from "../../../utils/assertFieldName"
import { mapKeys, pickBy } from "lodash"
import { CurrencyRecord } from "../../records/currency"

export function updateOneCurrency(id: string, fields: Partial<CurrencyRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)

  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(`UPDATE currencies SET ${set} WHERE id = $id`, {
    $id: id,
    ...mapKeys(fieldsToSet, (_, key) => `$${key}`)
  })

  return id
}
