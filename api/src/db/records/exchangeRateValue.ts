export interface ExchangeRateValueRecord {
  id: string
  dailyExchangeRateId: string
  toCurrencyCode: string
  rate: number

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
