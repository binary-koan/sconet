import { updateExchangeRates } from "../src/jobs/exchangeRates"
import { recalculateExchangeRates } from "../src/jobs/recalculateExchangeRates"
import { runDbSession } from "../src/utils/runDbSession"

const jobs: { [name: string]: (() => Promise<void>) | undefined } = {
  updateExchangeRates,
  recalculateExchangeRates
}

const job = jobs[process.argv[2]]

if (job) {
  console.log(`Job: ${process.argv[2]}`)
  await runDbSession(job)
  console.log("Done")
} else {
  console.log(`Unknown job: ${process.argv[2]}. Available: ${Object.keys(jobs).join(", ")}`)
}
