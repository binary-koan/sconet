import { omit, pick, sum } from "lodash"
import { deleteSplitTransactions } from "../db/queries/transaction/deleteSplitTransactions"
import { findTransactions } from "../db/queries/transaction/findTransactions"
import { getTransaction } from "../db/queries/transaction/getTransaction"
import { insertTransaction } from "../db/queries/transaction/insertTransaction"
import { softDeleteSplitTransactions } from "../db/queries/transaction/softDeleteSplitTransactions"
import { softDeleteTransaction } from "../db/queries/transaction/softDeleteTransaction"
import { updateOneTransaction } from "../db/queries/transaction/updateOneTransaction"
import { updateSplitTransactions } from "../db/queries/transaction/updateSplitTransactions"
import { TransactionRecord } from "../db/records/transaction"
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UpdateTransactionInput
} from "../resolvers-types"

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

  let updateInput: Partial<UpdateTransactionInput> = input
  if (transaction.splitFromId) {
    updateInput = omit(input, parentAttributes)
  }

  const updates: Partial<TransactionRecord> = {
    ...updateInput,
    memo: updateInput.memo || undefined,
    amount: updateInput.amount || undefined,
    currencyId: updateInput.currencyId || undefined,
    date: updateInput.date || undefined,
    includeInReports: updateInput.includeInReports || undefined,
    accountMailboxId: updateInput.accountMailboxId || undefined
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
  id: (transaction) => transaction.id,
  amount: async (transaction, _, context) => ({
    amount: transaction.amount,
    currency: await context.data.currency.load(transaction.currencyId)
  }),
  currencyId: (transaction) => transaction.currencyId,
  date: (transaction) => transaction.date,
  memo: (transaction) => transaction.memo,
  originalMemo: (transaction) => transaction.originalMemo,
  includeInReports: (transaction) => transaction.includeInReports,

  categoryId: (transaction) => transaction.categoryId,
  accountMailboxId: (transaction) => transaction.accountMailboxId,
  splitFromId: (transaction) => transaction.splitFromId,

  currency: async (transaction, _, context) =>
    await context.data.currency.load(transaction.currencyId),

  category: async (transaction, _, context) =>
    transaction.categoryId ? await context.data.category.load(transaction.categoryId) : null,

  accountMailbox: async (transaction, _, context) =>
    await context.data.accountMailbox.load(transaction.accountMailboxId),

  splitFrom: async (transaction, _, context) =>
    transaction.splitFromId ? await context.data.transaction.load(transaction.splitFromId) : null,

  splitTo: async (transaction, _, context) =>
    await context.data.transactionSplitTo.load(transaction.id)
}

export const PaginatedTransactions: Resolvers["PaginatedTransactions"] = {
  data: (result) => result.data,
  nextOffset: (result) => result.nextOffset || null,
  totalCount: (result) => result.totalCount
}
