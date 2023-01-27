export interface DailyExchangeRateRecord {
  id: string
  fromCurrencyId: string
  toCurrencyId: string
  rate: number
  date: Date

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
