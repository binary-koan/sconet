import { db } from "../../database"
import { TransactionRecord } from "../../records/transaction"
import { assertFieldName } from "../../../utils/assertFieldName"
import { filter, mapKeys } from "lodash"

export function updateOneTransaction(id: string, fields: Partial<TransactionRecord>) {
  const fieldsToSet = filter(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(
    `UPDATE transactions SET ${set} WHERE id = $id`,
    mapKeys(fieldsToSet, (key) => `$${key}`)
  )

  return id
}
