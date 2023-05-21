import { TransactionRecord } from "../../records/transaction"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeTransaction(transaction: Partial<TransactionRecord>) {
  return serializePartialRecord(transaction)
}
