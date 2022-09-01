import { db } from "../../database"
import { assertFieldName } from "../../../utils/assertFieldName"
import { filter, mapKeys } from "lodash"
import { AccountMailboxRecord } from "../../records/accountMailbox"

export function updateOneAccountMailbox(id: string, fields: Partial<AccountMailboxRecord>) {
  const fieldsToSet = filter(fields, (value) => value !== undefined)
  const set = Object.keys(fieldsToSet).map((key) => assertFieldName(key) && `${key} = $${key}`)

  db.run(
    `UPDATE accountMailboxes SET ${set} WHERE id = $id`,
    mapKeys(fieldsToSet, (key) => `$${key}`)
  )

  return id
}
