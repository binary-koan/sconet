export interface ExchangeRateRecord {
  id: string
  fromCurrencyId: string
  toCurrencyId: string
  rate: number

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
