import { AccountRecord } from "../../records/account"

export function loadAccount(row: any): AccountRecord {
  return {
    id: row.id,
    name: row.name,

    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }
}
