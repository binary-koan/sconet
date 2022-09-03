import jwt from "jsonwebtoken"
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

export interface Context {
  auth?: {
    userId: string
  }
  data: {
    accountMailbox: Dataloader<string, AccountMailboxRecord>
    category: Dataloader<string, CategoryRecord>
    transaction: Dataloader<string, TransactionRecord>
    transactionSplitTo: Dataloader<string, TransactionRecord[]>
  }
}

export async function buildContext(
  request: Request,
  _executionContext: ExecutionContext
): Promise<Context> {
  return {
    auth: getAuthDetails(request),
    data: {
      accountMailbox: new Dataloader(async (ids) => findAccountMailboxesByIds(ids)),
      category: new Dataloader(async (ids) => findCategoriesByIds(ids)),
      transaction: new Dataloader(async (ids) => findTransactionsByIds(ids)),
      transactionSplitTo: new Dataloader(async (ids) => findTransactionsSplitToByIds(ids))
    }
  }
}

export function getAuthDetails(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer /, "")

  if (!token) {
    return
  }

  if (!process.env.JWT_SECRET) {
    throw new GraphQLError("No JWT secret set")
  }

  const body = jwt.verify(token, process.env.JWT_SECRET)

  if (!body || typeof body === "string" || !body.sub) {
    throw new GraphQLError("Invalid token")
  }

  return {
    userId: body.sub
  }
}
