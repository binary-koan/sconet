import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"

export const recalculateExchangeRates = async () => {
  for (const transaction of await transactionsRepo.findAll()) {
    await transactionsRepo.updateOne(transaction.id, {
      dailyExchangeRateId: (await dailyExchangeRatesRepo.findClosest(
        transaction.date,
        transaction.currencyId
      ))!.id
    })
  }
}
