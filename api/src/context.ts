import Dataloader from "dataloader"
import { GraphQLError } from "graphql"
import { errors, jwtVerify } from "jose"
import { last } from "lodash"
import { Currencies } from "ts-money"
import { AccountRecord } from "./db/records/account"
import { CategoryRecord } from "./db/records/category"
import { TransactionRecord } from "./db/records/transaction"
import { UserRecord } from "./db/records/user"
import { accountsRepo } from "./db/repos/accountsRepo"
import { categoriesRepo } from "./db/repos/categoriesRepo"
import { transactionsRepo } from "./db/repos/transactionsRepo"
import { usersRepo } from "./db/repos/usersRepo"
import { CurrencyValuesLoader, currencyValuesLoader } from "./utils/currencyValuesLoader"
import { ExchangeRatesLoader, exchangeRatesLoader } from "./utils/exchangeRatesLoader"

export interface Context {
  remoteIp?: string
  currentUser?: UserRecord
  defaultCurrencyCode: string
  data: {
    account: Dataloader<string, AccountRecord>
    category: Dataloader<string, CategoryRecord>
    transaction: Dataloader<string, TransactionRecord>
    transactionSplitTo: Dataloader<string, TransactionRecord[]>
    exchangeRates: ExchangeRatesLoader
    currencyValues: CurrencyValuesLoader
  }
}

export async function buildContext(request: Request): Promise<Context> {
  const currentUser = await getCurrentUser(request)
  const exchangeRates = exchangeRatesLoader()

  return {
    remoteIp: getRemoteIp(request) ?? undefined,

    currentUser,

    get defaultCurrencyCode() {
      return currentUser?.settings.defaultCurrencyCode || Currencies.USD.code
    },

    data: {
      account: new Dataloader(async (ids) => accountsRepo.findByIds(ids)),
      category: new Dataloader(async (ids) => categoriesRepo.findByIds(ids)),
      transaction: new Dataloader(async (ids) => transactionsRepo.findByIds(ids)),
      transactionSplitTo: new Dataloader(async (ids) =>
        transactionsRepo.findSplitTransactionsByIds(ids)
      ),
      exchangeRates,
      currencyValues: currencyValuesLoader(exchangeRates)
    }
  }
}

async function getCurrentUser(request: Request) {
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

    return await usersRepo.get(body.payload.sub!)
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
