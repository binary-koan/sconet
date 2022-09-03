import { db } from "../../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { AccountMailboxRecord } from "../../records/accountMailbox"
import { serializeDate } from "../../utils"

export type AccountMailboxForInsert = MakeOptional<
  Omit<AccountMailboxRecord, "id">,
  | "mailServerOptions"
  | "fromAddressPattern"
  | "datePattern"
  | "memoPattern"
  | "amountPattern"
  | "deletedAt"
  | "createdAt"
  | "updatedAt"
>

export function insertAccountMailbox(accountMailbox: AccountMailboxForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO accountMailboxes
      (id, name, mailServerOptions, fromAddressPattern, datePattern, memoPattern, amountPattern, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $name, $mailServerOptions, $fromAddressPattern, $datePattern, $memoPattern, $amountPattern, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $name: accountMailbox.name,
      $mailServerOptions:
        accountMailbox.mailServerOptions && JSON.stringify(accountMailbox.mailServerOptions),
      $fromAddressPattern: accountMailbox.fromAddressPattern,
      $datePattern: accountMailbox.datePattern,
      $memoPattern: accountMailbox.memoPattern,
      $amountPattern: accountMailbox.amountPattern,
      $deletedAt: serializeDate(accountMailbox.deletedAt),
      $createdAt: serializeDate(accountMailbox.createdAt || new Date()),
      $updatedAt: serializeDate(accountMailbox.updatedAt || new Date())
    }
  )

  return id
}
