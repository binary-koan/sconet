export interface ExchangeRateValueRecord {
  id: string
  dailyExchangeRateId: string
  toCurrencyId: string
  rate: number

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
