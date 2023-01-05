import { CurrencyRecord } from "../../records/currency"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeCurrency(currency: Partial<CurrencyRecord>) {
  return serializePartialRecord(currency, {
    deletedAt: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
