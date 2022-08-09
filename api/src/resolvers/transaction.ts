import { sum, pick, omit } from "lodash"
import { TransactionRecord } from "../db/transaction"
import { deleteSplitTransactions } from "../db/transaction/deleteSplitTransactions"
import { findTransactions } from "../db/transaction/findTransactions"
import { getTransaction } from "../db/transaction/getTransaction"
import { insertTransaction } from "../db/transaction/insertTransaction"
import { softDeleteSplitTransactions } from "../db/transaction/softDeleteSplitTransactions"
import { softDeleteTransaction } from "../db/transaction/softDeleteTransaction"
import { updateOneTransaction } from "../db/transaction/updateOneTransaction"
import { updateSplitTransactions } from "../db/transaction/updateSplitTransactions"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const transactions: QueryResolvers["transactions"] = (_, { limit, offset, filter }) => {
  return findTransactions({ limit, offset, filter })
}

export const transaction: QueryResolvers["transaction"] = (_, { id }) => {
  return getTransaction(id) || null
}

export const createTransaction: MutationResolvers["createTransaction"] = (_, { input }) => {
  const id = insertTransaction({
    ...input,
    date: input.date || new Date(),
    includeInReports: input.includeInReports || true,
    originalMemo: input.memo
  })

  return getTransaction(id)!
}

export const updateTransaction: MutationResolvers["updateTransaction"] = (_, { id, input }) => {
  const transaction = getTransaction(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  const parentAttributes = ["date", "accountMailboxId"]

  if (transaction.splitFromId) {
    input = omit(input, parentAttributes)
  }

  const updates: Partial<TransactionRecord> = {
    ...input,
    memo: input.memo || undefined,
    amount: input.amount || undefined,
    date: input.date || undefined,
    includeInReports: input.includeInReports || undefined,
    accountMailboxId: input.accountMailboxId || undefined
  }

  updateOneTransaction(id, updates)

  updateSplitTransactions(id, pick(updates, ...parentAttributes, "includeInReports"))

  return getTransaction(id)!
}

export const deleteTransaction: MutationResolvers["deleteTransaction"] = (_, { id }) => {
  const transaction = getTransaction(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  softDeleteTransaction(id)
  softDeleteSplitTransactions(id)

  return transaction
}

export const splitTransaction: MutationResolvers["splitTransaction"] = async (
  _,
  { id, amounts }
) => {
  const transaction = getTransaction(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  if (sum(amounts) !== transaction.amount) {
    throw new Error("Transaction amounts do not match")
  }

  if (transaction.splitFromId) {
    throw new Error(`Transaction is already split from ${transaction.splitFromId}`)
  }

  deleteSplitTransactions(transaction.id)

  const { id: _id, ...transactionAttributes } = transaction

  amounts.forEach((amount) => {
    insertTransaction({
      ...transactionAttributes,
      splitFromId: transaction.id,
      amount
    })
  })

  return transaction
}

export const Transaction: Resolvers["Transaction"] = {
  category: async (transaction, _, context) =>
    transaction.categoryId ? await context.data.category.load(transaction.categoryId) : null,

  accountMailbox: async (transaction, _, context) =>
    await context.data.accountMailbox.load(transaction.accountMailboxId),

  splitFrom: async (transaction, _, context) =>
    transaction.splitFromId ? await context.data.transaction.load(transaction.splitFromId) : null,

  splitTo: async (transaction, _, context) =>
    await context.data.transactionSplitTo.load(transaction.id)
}
