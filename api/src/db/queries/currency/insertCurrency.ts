import { db } from "../../database"
import ObjectID from "bson-objectid"
import { MakeOptional } from "../../../types"
import { serializeDate } from "../../utils"
import { CurrencyRecord } from "../../records/currency"

export type CategoryForInsert = MakeOptional<
  Omit<CurrencyRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export function insertCurrency(category: CategoryForInsert) {
  const id = ObjectID().toHexString()

  db.run(
    `
    INSERT INTO currencies
      (id, code, symbol, decimalDigits, deletedAt, createdAt, updatedAt)
    VALUES
      ($id, $code, $symbol, $decimalDigits, $deletedAt, $createdAt, $updatedAt)
  `,
    {
      $id: id,
      $code: category.code,
      $symbol: category.symbol,
      $decimalDigits: category.decimalDigits,
      $deletedAt: serializeDate(category.deletedAt),
      $createdAt: serializeDate(category.createdAt || new Date()),
      $updatedAt: serializeDate(category.updatedAt || new Date())
    }
  )

  return id
}
