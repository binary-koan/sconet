import Dataloader from "dataloader"
import { AccountMailboxRecord } from "./db/accountMailbox"
import { TransactionRecord } from "./db/transaction"

export interface Context {
  data: {
    accountMailbox: Dataloader<string, AccountMailboxRecord>
    category: Dataloader<string, any>
    transaction: Dataloader<string, TransactionRecord>
    transactionSplitTo: Dataloader<string, TransactionRecord[]>
  }
}
