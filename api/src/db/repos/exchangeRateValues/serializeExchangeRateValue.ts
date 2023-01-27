import { ExchangeRateValueRecord } from "../../records/exchangeRateValue"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeExchangeRateValue(exchangeRateValue: Partial<ExchangeRateValueRecord>) {
  return serializePartialRecord(exchangeRateValue, {
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
