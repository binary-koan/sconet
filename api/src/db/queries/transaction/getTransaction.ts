import { db } from "../database"
import { TransactionRecord } from "../transaction"
import { loadTransaction } from "./loadTransaction"

export function getTransaction(id: string): TransactionRecord | undefined {
  const result = db.query("SELECT * FROM transactions WHERE id = ?").get(id)

  return result && loadTransaction(result)
}
