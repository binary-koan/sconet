import { updateExchangeRates } from "./jobs/exchangeRates"
import { recalculateExchangeRates } from "./jobs/recalculateExchangeRates"
import { runDbSession } from "./utils/runDbSession"

const jobs: { [name: string]: (() => Promise<void>) | undefined } = {
  updateExchangeRates,
  recalculateExchangeRates
}

export async function runJob(name: string) {
  const job = jobs[name]

  if (job) {
    console.log(`Job: ${name}`)
    await runDbSession(job)
    console.log("Done")
  } else {
    console.log(`Unknown job: ${name}. Available: ${Object.keys(jobs).join(", ")}`)
  }
}
