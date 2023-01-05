import { AccountMailboxRecord } from "../../records/accountMailbox"
import { loadDate } from "../../utils"

export function loadAccountMailbox(row: any): AccountMailboxRecord {
  return {
    id: row.id,
    name: row.name,

    mailServerOptions: row.mailServerOptions ? JSON.parse(row.mailServerOptions) : {},

    fromAddressPattern: row.fromAddressPattern,
    datePattern: row.datePattern,
    memoPattern: row.memoPattern,
    amountPattern: row.amountPattern,

    deletedAt: loadDate(row.deletedAt),
    createdAt: loadDate(row.createdAt as number),
    updatedAt: loadDate(row.updatedAt as number)
  }
}
