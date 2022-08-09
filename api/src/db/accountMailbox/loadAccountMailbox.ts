import { AccountMailboxRecord } from "../accountMailbox"

export function loadAccountMailbox(row: any): AccountMailboxRecord {
  return {
    id: row.id,
    name: row.name,

    mailServerOptions: row.mailServerOptions ? JSON.parse(row.mailServerOptions) : {},

    fromAddressPattern: row.fromAddressPattern,
    datePattern: row.datePattern,
    memoPattern: row.memoPattern,
    amountPattern: row.amountPattern,

    deletedAt: row.deletedAt && new Date(row.deletedAt),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt)
  }
}
