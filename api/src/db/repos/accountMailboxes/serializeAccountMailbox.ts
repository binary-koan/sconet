import { AccountMailboxRecord } from "../../records/accountMailbox"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeAccountMailbox(accountMailbox: Partial<AccountMailboxRecord>) {
  return serializePartialRecord(accountMailbox, {
    mailServerOptions: (options) => options && JSON.stringify(options),
    deletedAt: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
