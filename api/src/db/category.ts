import { db } from "./database"

db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,

    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    isRegular BOOLEAN NOT NULL,
    budget INTEGER,
    sortOrder INTEGER,

    deletedAt INTEGER,
    createdAt INTEGER,
    updatedAt INTEGER
  )
`)

export interface CategoryRecord {
  id: string
  name: string

  color: string
  icon: string
  isRegular: boolean
  budget: number | null
  sortOrder: number | null

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
