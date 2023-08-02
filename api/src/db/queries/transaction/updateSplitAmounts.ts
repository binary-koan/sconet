import { sum } from "lodash"
import { sql } from "../../database"
import { transactionsRepo } from "../../repos/transactionsRepo"

export async function updateSplitAmounts(
  id: string,
  updatedAmount: number,
  field: "amount" | "originalAmount" = "amount"
) {
  const alternateField = field === "amount" ? "originalAmount" : "amount"

  const splits = (await transactionsRepo.findSplitTransactionsByIds([id]))[0]

  const totalSplitAmount = sum(splits.map((split) => split[field] || split[alternateField] || 0))

  const ratio = updatedAmount / totalSplitAmount

  const updatedSplits = splits.map((split) => ({
    ...split,
    [field]: Math.floor((split[field] || split[alternateField] || 0) * ratio)
  }))

  let updateIndex = 0
  while (true) {
    const total = sum(updatedSplits.map((split) => split[field]))

    if (total === updatedAmount) {
      break
    }

    if (total > updatedAmount) {
      updatedSplits[updateIndex][field]! -= 1
    } else {
      updatedSplits[updateIndex][field]! += 1
    }

    updateIndex = (updateIndex + 1) % updatedSplits.length
  }

  await sql.begin(async (sql) => {
    await Promise.all(
      updatedSplits.map((split) =>
        transactionsRepo.updateOne(split.id, { [field]: split[field] }, sql)
      )
    )
  })
}
