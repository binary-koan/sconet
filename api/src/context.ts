import { jwtVerify, errors } from "jose"
import Dataloader from "dataloader"
import { ExecutionContext } from "graphql-helix"
import { AccountMailboxRecord } from "./db/records/accountMailbox"
import { findAccountMailboxesByIds } from "./db/queries/accountMailbox/findAccountMailboxesByIds"
import { CategoryRecord } from "./db/records/category"
import { findCategoriesByIds } from "./db/queries/category/findCategoriesByIds"
import { TransactionRecord } from "./db/records/transaction"
import { findTransactionsByIds } from "./db/queries/transaction/findTransactionsByIds"
import { findTransactionsSplitToByIds } from "./db/queries/transaction/findTransactionsSplitToByIds"
import { GraphQLError } from "graphql"
import { findCurrenciesByIds } from "./db/queries/currency/findCurrenciesByIds"
import { CurrencyRecord } from "./db/records/currency"
import { findExchangeRatesByCodes } from "./db/queries/exchangeRate/findExchangeRatesByCodes"
import { last } from "lodash"

export interface Context {
  auth?: {
    userId: string
  }
  data: {
    accountMailbox: Dataloader<string, AccountMailboxRecord>
    category: Dataloader<string, CategoryRecord>
    transaction: Dataloader<string, TransactionRecord>
    transactionSplitTo: Dataloader<string, TransactionRecord[]>
    currency: Dataloader<string, CurrencyRecord>
    exchangeRate: Dataloader<
      { from: string; to: string },
      { rate: number; fromId: string; toId: string }
    >
  }
}

export async function buildContext(
  request: Request,
  _executionContext: ExecutionContext
): Promise<Context> {
  return {
    auth: await getAuthDetails(request),
    data: {
      accountMailbox: new Dataloader(async (ids) => findAccountMailboxesByIds(ids)),
      category: new Dataloader(async (ids) => findCategoriesByIds(ids)),
      transaction: new Dataloader(async (ids) => findTransactionsByIds(ids)),
      transactionSplitTo: new Dataloader(async (ids) => findTransactionsSplitToByIds(ids)),
      currency: new Dataloader(async (ids) => findCurrenciesByIds(ids)),
      exchangeRate: new Dataloader(async (queries) => findExchangeRatesByCodes(queries))
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
    console.log("headers", [...request.headers.entries()])
    throw e
  }
}
