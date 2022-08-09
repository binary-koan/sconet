import { db } from "./database"

db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    memo TEXT NOT NULL,
    originalMemo TEXT NOT NULL,
    amount INTEGER NOT NULL,
    date INTEGER NOT NULL,
    includeInReports INTEGER NOT NULL,

    categoryId STRING,
    accountMailboxId STRING NOT NULL,

    remoteId STRING,

    splitFromId STRING,

    deletedAt INTEGER,

    createdAt INTEGER,
    updatedAt INTEGER
  )
`)

export interface TransactionRecord {
  id: string
  memo: string
  originalMemo: string
  amount: number
  date: Date
  includeInReports: boolean

  categoryId: string | null

  accountMailboxId: string
  remoteId: string | null

  splitFromId: string | null

  deletedAt: Date | null

  createdAt: Date
  updatedAt: Date
}
