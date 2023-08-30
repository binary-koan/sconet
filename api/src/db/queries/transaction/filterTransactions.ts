import { memoize } from "lodash"
import { Maybe } from "../../../types"
import { stripTime } from "../../../utils/date"
import { db } from "../../database"
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
  let where = db.sql`WHERE "splitFromId" IS NULL AND "deletedAt" IS NULL`

  if (filter?.accountId) {
    where = db.sql`${where} AND "accountId" = ${filter.accountId}`
  }

  if (filter?.dateFrom) {
    where = db.sql`${where} AND "date" >= ${stripTime(filter.dateFrom)}`
  }

  if (filter?.dateUntil) {
    where = db.sql`${where} AND "date" <= ${stripTime(filter.dateUntil)}`
  }

  if (filter?.minAmount != null) {
    where = db.sql`${where} AND "amount" >= ${filter.minAmount}`
  }

  if (filter?.maxAmount != null) {
    where = db.sql`${where} AND "amount" <= ${filter.maxAmount}`
  }

  if (filter?.keyword) {
    where = db.sql`${where} AND (
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

    let categoryIdsQuery = db.sql`FALSE`

    if (notNullIds.length)
      categoryIdsQuery = db.sql`${categoryIdsQuery} OR "categoryId" IN ${db.sql(notNullIds)}`
    if (hasNullId) categoryIdsQuery = db.sql`${categoryIdsQuery} OR "categoryId" IS NULL`

    where = db.sql`${where} AND (${categoryIdsQuery})`
  }

  if (filter?.includeInReports != null) {
    where = db.sql`${where} AND "includeInReports" = ${filter.includeInReports}`
  }

  if (offset) {
    const date = new Date(JSON.parse(Buffer.from(offset, "base64").toString("utf-8")).date)

    where = db.sql`${where} AND "date" <= ${date}`
  }

  let limitClause = db.sql``

  if (limit) {
    limitClause = db.sql`LIMIT ${limit + 1}`
  }

  const data = memoize(
    async () =>
      await db.sql<
        TransactionRecord[]
      >`SELECT * FROM "transactions" ${where} ORDER BY "date" DESC, "amount" ASC, "id" ASC ${limitClause}`
  )

  const totalCount = memoize(
    async () => (await db.sql`SELECT COUNT(*) AS "count" FROM "transactions" ${where}`)[0].count
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
