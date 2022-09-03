import { db } from "../../database"
import { TransactionRecord } from "../../records/transaction"
import { assertFieldName } from "../../../utils/assertFieldName"
import { mapKeys, pickBy } from "lodash"

export function updateOneTransaction(id: string, fields: Partial<TransactionRecord>) {
  const fieldsToSet = pickBy(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(`UPDATE transactions SET ${set} WHERE id = $id`, {
    $id: id,
    ...mapKeys(fieldsToSet, (_, key) => `$${key}`)
  })

  return id
}
