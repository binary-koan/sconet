import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"

export const recalculateExchangeRates = async () => {
  for (const transaction of transactionsRepo.findAll()) {
    transactionsRepo.updateOne(transaction.id, {
      dailyExchangeRateId: dailyExchangeRatesRepo.findClosest(
        transaction.date,
        transaction.currencyId
      )!.id
    })
  }
}
