import { memoize } from "lodash"
import { Maybe } from "../../../types"
import { sql } from "../../database"
import { TransactionRecord } from "../../records/transaction"

export interface FindTransactionsResult {
  data: Promise<TransactionRecord[]>
  nextOffset: Promise<string | undefined>
  totalCount: Promise<number>
}

export function filterTransactions({
  limit,
  offset,
  filter
}: {
  limit?: Maybe<number>
  offset?: Maybe<string>
  filter?: Maybe<{
    accountId?: Maybe<string>
    dateFrom?: Maybe<Date>
    dateUntil?: Maybe<Date>
    minAmount?: Maybe<number>
    maxAmount?: Maybe<number>
    keyword?: Maybe<string>
    categoryIds?: Maybe<Array<string | null>>
    includeInReports?: Maybe<boolean>
  }>
}): FindTransactionsResult {
  let where = sql`WHERE "splitFromId" IS NULL AND "deletedAt" IS NULL`

  if (filter?.accountId) {
    where = sql`${where} AND "accountId" = ${filter.accountId}`
  }

  if (filter?.dateFrom) {
    where = sql`${where} AND "date" >= ${filter.dateFrom}`
  }

  if (filter?.dateUntil) {
    where = sql`${where} AND "date" <= ${filter.dateUntil}`
  }

  if (filter?.minAmount != null) {
    where = sql`${where} AND "amount" >= ${filter.minAmount}`
  }

  if (filter?.maxAmount != null) {
    where = sql`${where} AND "amount" <= ${filter.maxAmount}`
  }

  if (filter?.keyword) {
    where = sql`${where} AND (
      "memo" LIKE ${filter.keyword}
      OR EXISTS (
        SELECT 1 FROM "transactions" "other"
        WHERE "other"."splitFromId" = "transactions"."id"
        AND "other"."memo" LIKE ${filter.keyword}
      )
    )`
  }

  if (filter?.categoryIds?.length) {
    const notNullIds = filter.categoryIds.filter((categoryId) => categoryId) as string[]
    const hasNullId = filter.categoryIds.some((categoryId) => !categoryId)

    let categoryIdsQuery = sql`FALSE`

    if (notNullIds.length)
      categoryIdsQuery = sql`${categoryIdsQuery} OR "categoryId" IN ${sql(notNullIds)}`
    if (hasNullId) categoryIdsQuery = sql`${categoryIdsQuery} OR "categoryId" IS NULL`

    where = sql`${where} AND (${categoryIdsQuery})`
  }

  if (filter?.includeInReports != null) {
    where = sql`${where} AND "includeInReports" = ${filter.includeInReports}`
  }

  if (offset) {
    const date = new Date(JSON.parse(Buffer.from(offset, "base64").toString("utf-8")).date)

    where = sql`${where} AND "date" <= ${date}`
  }

  let limitClause = sql``

  if (limit) {
    limitClause = sql`LIMIT ${limit + 1}`
  }

  const data = memoize(
    async () =>
      await sql<
        TransactionRecord[]
      >`SELECT * FROM "transactions" ${where} ORDER BY "date" DESC, "amount" DESC, "id" ASC ${limitClause}`
  )

  const totalCount = memoize(
    async () => (await sql`SELECT COUNT(*) AS "count" FROM "transactions" ${where}`)[0].count
  )

  return {
    get data() {
      return data().then((data) =>
        limit && data.length > limit ? data.slice(0, data.length - 1) : data
      )
    },
    get nextOffset() {
      return data().then((data) =>
        limit && data.length > limit
          ? Buffer.from(JSON.stringify({ date: data[data.length - 1].date })).toString("base64")
          : undefined
      )
    },
    get totalCount() {
      return totalCount()
    }
  }
}
