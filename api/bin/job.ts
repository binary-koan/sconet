import { runBackup } from "../src/jobs/backup"
import { updateExchangeRates } from "../src/jobs/exchangeRates"

const jobs: { [name: string]: (() => Promise<void>) | undefined } = {
  runBackup,
  updateExchangeRates
}

const job = jobs[process.argv[2]]

if (job) {
  console.log(`Job: ${process.argv[2]}`)
  await job()
  console.log("Done")
} else {
  console.log(`Unknown job: ${process.argv[2]}. Available: ${Object.keys(jobs).join(", ")}`)
}
