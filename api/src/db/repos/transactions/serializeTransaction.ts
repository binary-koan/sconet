import { TransactionRecord } from "../../records/transaction"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeTransaction(transaction: Partial<TransactionRecord>) {
  return serializePartialRecord(transaction, {
    date: serializeDate,
    deletedAt: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
