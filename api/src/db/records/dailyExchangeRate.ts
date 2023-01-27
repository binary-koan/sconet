export interface DailyExchangeRateRecord {
  id: string
  fromCurrencyId: string
  date: Date

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
