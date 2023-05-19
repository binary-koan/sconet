import { updateExchangeRates } from "../../jobs/exchangeRates"
import { dailyExchangeRatesRepo } from "../repos/dailyExchangeRatesRepo"
import { transactionsRepo } from "../repos/transactionsRepo"

export async function up() {
  await updateExchangeRates()

  for (const transaction of await transactionsRepo.findAll()) {
    const exchangeRate = await dailyExchangeRatesRepo.findClosest(
      transaction.date,
      transaction.currencyId
    )

    if (exchangeRate) {
      transactionsRepo.updateOne(transaction.id, { dailyExchangeRateId: exchangeRate.id })
    }
  }
}

export async function down() {
  // Do nothing
}
