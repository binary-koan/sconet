import { db } from "./database"

db.run(`
  CREATE TABLE IF NOT EXISTS accountMailboxes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,

    mailServerOptions TEXT,

    fromAddressPattern TEXT,
    datePattern TEXT,
    memoPattern TEXT,
    amountPattern TEXT,

    deletedAt INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER
  )
`)

export interface AccountMailboxRecord {
  id: string
  name: string

  mailServerOptions: any

  fromAddressPattern: string | null
  datePattern: string | null
  memoPattern: string | null
  amountPattern: string | null

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
