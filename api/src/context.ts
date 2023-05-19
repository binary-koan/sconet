import Dataloader from "dataloader"
import { GraphQLError } from "graphql"
import { errors, jwtVerify } from "jose"
import { fromPairs, last, memoize, uniqBy } from "lodash"
import { convertAmounts } from "./db/queries/exchangeRateValues/convertAmounts"
import { AccountMailboxRecord } from "./db/records/accountMailbox"
import { CategoryRecord } from "./db/records/category"
import { CurrencyRecord } from "./db/records/currency"
import { DailyExchangeRateRecord } from "./db/records/dailyExchangeRate"
import { ExchangeRateValueRecord } from "./db/records/exchangeRateValue"
import { TransactionRecord } from "./db/records/transaction"
import { accountMailboxesRepo } from "./db/repos/accountMailboxesRepo"
import { categoriesRepo } from "./db/repos/categoriesRepo"
import { currenciesRepo } from "./db/repos/currenciesRepo"
import { dailyExchangeRatesRepo } from "./db/repos/dailyExchangeRatesRepo"
import { exchangeRateValuesRepo } from "./db/repos/exchangeRateValuesRepo"
import { transactionsRepo } from "./db/repos/transactionsRepo"

export interface Context {
  remoteIp?: string
  auth?: {
    userId: string
  }
  defaultCurrencyId: Promise<string>
  data: {
    accountMailbox: Dataloader<string, AccountMailboxRecord>
    category: Dataloader<string, CategoryRecord>
    transaction: Dataloader<string, TransactionRecord>
    transactionSplitTo: Dataloader<string, TransactionRecord[]>
    currency: Dataloader<string, CurrencyRecord>
    dailyExchangeRate: Dataloader<{ fromCurrencyId: string; date?: Date }, DailyExchangeRateRecord>
    exchangeRateValue: Dataloader<
      { dailyExchangeRateId: string; toCurrencyId: string },
      ExchangeRateValueRecord
    >
    amountInCurrency: Dataloader<
      { fromCurrencyId: string; toCurrencyId: string; dailyExchangeRateId: string; amount: number },
      number
    >
  }
}

export async function buildContext(request: Request): Promise<Context> {
  const defaultCurrencyId = memoize(
    async () =>
      request.headers.get("x-default-currency-id") || (await currenciesRepo.findAll())[0].id
  )

  return {
    remoteIp: getRemoteIp(request) ?? undefined,

    auth: await getAuthDetails(request),

    get defaultCurrencyId() {
      return defaultCurrencyId()
    },

    data: {
      accountMailbox: new Dataloader(async (ids) => accountMailboxesRepo.findByIds(ids)),
      category: new Dataloader(async (ids) => categoriesRepo.findByIds(ids)),
      transaction: new Dataloader(async (ids) => transactionsRepo.findByIds(ids)),
      transactionSplitTo: new Dataloader(async (ids) =>
        transactionsRepo.findSplitTransactionsByIds(ids)
      ),
      currency: new Dataloader(async (ids) => currenciesRepo.findByIds(ids)),

      dailyExchangeRate: new Dataloader(async (queries) => {
        const queriesWithId = queries.map((query) => ({
          id: `${query.fromCurrencyId}-${query.date}`,
          ...query
        }))
        const resultsById = fromPairs(
          await Promise.all(
            uniqBy(queriesWithId, "id").map(async ({ id, fromCurrencyId, date }) => [
              id,
              await dailyExchangeRatesRepo.findClosest(date || new Date(), fromCurrencyId)
            ])
          )
        )

        return queriesWithId.map(({ id }) => resultsById[id]!)
      }),

      exchangeRateValue: new Dataloader(async (queries) => {
        const all = await exchangeRateValuesRepo.findForRates(
          queries.map((query) => query.dailyExchangeRateId)
        )

        return queries.map(
          (query) =>
            all.find(
              (value) =>
                value.dailyExchangeRateId === query.dailyExchangeRateId &&
                value.toCurrencyId === query.toCurrencyId
            )!
        )
      }),

      amountInCurrency: new Dataloader(async (queries) => convertAmounts(queries))
    }
  }
}

async function getAuthDetails(request: Request) {
  try {
    const token = last(request.headers.get("authorization")?.split(" ") || [])

    if (!token) {
      return
    }

    if (!process.env.JWT_SECRET) {
      throw new GraphQLError("No JWT secret set")
    }

    const body = await jwtVerify(token, Buffer.from(process.env.JWT_SECRET))

    if (!body.payload.sub) {
      throw new GraphQLError("Invalid token")
    }

    return {
      userId: body.payload.sub
    }
  } catch (e) {
    if (e instanceof errors.JWTExpired) {
      return
    }

    console.error(e)
    throw e
  }
}

function getRemoteIp(request: Request) {
  // Bun currently can't get the request IP directly: https://github.com/oven-sh/bun/issues/518
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")
}
