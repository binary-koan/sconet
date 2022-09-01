import { db } from "../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../types"
import { AccountMailboxRecord } from "../accountMailbox"

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
      $deletedAt: accountMailbox.deletedAt?.getTime(),
      $createdAt: (accountMailbox.createdAt || new Date()).getTime(),
      $updatedAt: (accountMailbox.updatedAt || new Date()).getTime()
    }
  )

  return id
}
