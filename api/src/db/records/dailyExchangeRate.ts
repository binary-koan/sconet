export interface DailyExchangeRateRecord {
  id: string
  fromCurrencyCode: string
  date: Date

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
