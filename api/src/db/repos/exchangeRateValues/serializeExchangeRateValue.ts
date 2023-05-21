import { ExchangeRateValueRecord } from "../../records/exchangeRateValue"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeExchangeRateValue(exchangeRateValue: Partial<ExchangeRateValueRecord>) {
  return serializePartialRecord(exchangeRateValue)
}
