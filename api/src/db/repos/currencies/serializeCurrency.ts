import { CurrencyRecord } from "../../records/currency"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeCurrency(currency: Partial<CurrencyRecord>) {
  return serializePartialRecord(currency)
}
