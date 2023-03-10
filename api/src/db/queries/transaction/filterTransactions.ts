import { memoize } from "lodash"
import { Maybe } from "../../../types"
import { db } from "../../database"
import { TransactionRecord } from "../../records/transaction"
import { loadTransaction } from "../../repos/transactions/loadTransaction"
import { serializeDate } from "../../utils"
import { arrayBindings, arrayQuery } from "../../utils/fields"

export interface FindTransactionsResult {
  data: TransactionRecord[]
  nextOffset?: string
  totalCount: number
}

export function filterTransactions({
  limit,
  offset,
  filter
}: {
  limit?: Maybe<number>
  offset?: Maybe<string>
  filter?: Maybe<{
    accountMailboxId?: Maybe<string>
    dateFrom?: Maybe<Date>
    dateUntil?: Maybe<Date>
    minAmount?: Maybe<number>
    maxAmount?: Maybe<number>
    keyword?: Maybe<string>
    categoryIds?: Maybe<Array<string | null>>
  }>
}): FindTransactionsResult {
  let where = " WHERE splitFromId IS NULL AND deletedAt IS NULL"
  let args: Record<string, string | bigint | TypedArray | number | boolean | null> = {}

  if (filter?.accountMailboxId) {
    where += " AND accountMailboxId = $accountMailboxId"
    args.$accountMailboxId = filter.accountMailboxId
  }

  if (filter?.dateFrom) {
    where += " AND date >= $dateFrom"
    args.$dateFrom = serializeDate(filter.dateFrom)
  }

  if (filter?.dateUntil) {
    where += " AND date <= $dateUntil"
    args.$dateUntil = serializeDate(filter.dateUntil)
  }

  if (filter?.minAmount != null) {
    where += " AND amount >= $minAmount"
    args.$minAmount = filter.minAmount
  }

  if (filter?.maxAmount != null) {
    where += " AND amount <= $maxAmount"
    args.$maxAmount = filter.maxAmount
  }

  if (filter?.keyword) {
    where += ` AND (
      memo LIKE $keyword
      OR originalMemo LIKE $keyword
      OR EXISTS (
        SELECT 1 FROM transactions other
        WHERE other.splitFromId = transactions.id
        AND (other.memo LIKE $keyword OR other.originalMemo LIKE $keyword)
      )
    )`
    args.$keyword = filter.keyword
  }

  if (filter?.categoryIds?.length) {
    const notNullIds = filter.categoryIds.filter((categoryId) => categoryId) as string[]
    const hasNullId = filter.categoryIds.some((categoryId) => !categoryId)

    const categoryIdsQueries = [
      notNullIds.length && `categoryId IN ${arrayQuery(notNullIds, "categoryId")}`,
      hasNullId && "categoryId IS NULL"
    ]
      .filter(Boolean)
      .join(" OR ")

    where += ` AND (${categoryIdsQueries})`
    args = { ...args, ...arrayBindings(notNullIds, "categoryId") }
  }

  if (offset) {
    const date = new Date(JSON.parse(atob(offset)).date)

    where += " AND date <= $offsetDate"
    args.$offsetDate = serializeDate(date)
  }

  let limitClause = ""

  if (limit) {
    limitClause = "LIMIT $limit"
    args.$limit = limit + 1
  }

  const data = memoize(() =>
    db
      .query(
        `SELECT * FROM transactions ${where} ORDER BY date DESC, amount DESC, id ASC ${limitClause}`
      )
      .all(args)
      .map(loadTransaction)
  )

  const totalCount = memoize(
    () => db.query(`SELECT COUNT(*) AS count FROM transactions ${where}`).get().count
  )

  return {
    get data() {
      return limit && data().length > limit ? data().slice(0, data.length - 1) : data()
    },
    get nextOffset() {
      return limit && data().length > limit
        ? btoa(JSON.stringify({ date: data()[data().length - 1].date }))
        : undefined
    },
    get totalCount() {
      return totalCount()
    }
  }
}
