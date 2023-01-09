import Dataloader from "dataloader"
import { GraphQLError } from "graphql"
import { ExecutionContext } from "graphql-helix"
import { errors, jwtVerify } from "jose"
import { last } from "lodash"
import { findExchangeRatesByCodes } from "./db/queries/exchangeRate/findExchangeRatesByCodes"
import { AccountMailboxRecord } from "./db/records/accountMailbox"
import { CategoryRecord } from "./db/records/category"
import { CurrencyRecord } from "./db/records/currency"
import { TransactionRecord } from "./db/records/transaction"
import { accountMailboxesRepo } from "./db/repos/accountMailboxesRepo"
import { categoriesRepo } from "./db/repos/categoriesRepo"
import { currenciesRepo } from "./db/repos/currenciesRepo"
import { transactionsRepo } from "./db/repos/transactionsRepo"

export interface Context {
  remoteIp?: string
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
    remoteIp: getRemoteIp(request) ?? undefined,
    auth: await getAuthDetails(request),
    data: {
      accountMailbox: new Dataloader(async (ids) => accountMailboxesRepo.findByIds(ids)),
      category: new Dataloader(async (ids) => categoriesRepo.findByIds(ids)),
      transaction: new Dataloader(async (ids) => transactionsRepo.findByIds(ids)),
      transactionSplitTo: new Dataloader(async (ids) =>
        transactionsRepo.findSplitTransactionsByIds(ids)
      ),
      currency: new Dataloader(async (ids) => currenciesRepo.findByIds(ids)),
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
    throw e
  }
}

function getRemoteIp(request: Request) {
  // Bun currently can't get the request IP directly: https://github.com/oven-sh/bun/issues/518
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")
}
