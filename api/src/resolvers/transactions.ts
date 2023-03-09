import { omit, pick, sum } from "lodash"
import { TransactionRecord } from "../db/records/transaction"
import { dailyExchangeRatesRepo } from "../db/repos/dailyExchangeRatesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UpdateTransactionInput
} from "../resolvers-types"
import { convertCurrency, sumCurrency } from "./money"

export interface DailyTransactionsResult {
  date: Date
  transactions: TransactionRecord[]
}

export const transactions: QueryResolvers["transactions"] = (_, { limit, offset, filter }) => {
  return transactionsRepo.filter({ limit, offset, filter })
}

export const transactionsByDay: QueryResolvers["transactionsByDay"] = (
  _,
  { dateFrom, dateUntil }
) => {
  const transactions = transactionsRepo.filter({ filter: { dateFrom, dateUntil } }).data

  const dates: DailyTransactionsResult[] = []

  let date = new Date(dateFrom)

  while (date.getTime() <= dateUntil.getTime()) {
    dates.push({
      date: new Date(date),
      transactions: transactions.filter(
        (transaction) => transaction.date.getTime() === date.getTime()
      )
    })

    date.setDate(date.getDate() + 1)
  }

  return dates
}

export const transaction: QueryResolvers["transaction"] = (_, { id }) => {
  return transactionsRepo.get(id) || null
}

export const createTransaction: MutationResolvers["createTransaction"] = (_, { input }) => {
  const id = transactionsRepo.insert({
    ...input,
    date: input.date || new Date(),
    dailyExchangeRateId: dailyExchangeRatesRepo.findClosest(input.date, input.currencyId)!.id,
    includeInReports: input.includeInReports || true,
    originalMemo: input.memo
  })

  return transactionsRepo.get(id)!
}

export const updateTransaction: MutationResolvers["updateTransaction"] = (_, { id, input }) => {
  const transaction = transactionsRepo.get(id)

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
    memo: updateInput.memo ?? undefined,
    amount: updateInput.amount ?? undefined,
    currencyId: updateInput.currencyId ?? undefined,
    date: updateInput.date ?? undefined,
    includeInReports: updateInput.includeInReports ?? undefined,
    accountMailboxId: updateInput.accountMailboxId ?? undefined
  }

  transactionsRepo.updateOne(id, updates)
  transactionsRepo.updateSplitTransactions(
    id,
    pick(updates, ...parentAttributes, "includeInReports")
  )

  return transactionsRepo.get(id)!
}

export const deleteTransaction: MutationResolvers["deleteTransaction"] = (_, { id }) => {
  const transaction = transactionsRepo.get(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  transactionsRepo.softDelete(id)
  transactionsRepo.softDeleteSplitTransactions(id)

  return transaction
}

export const splitTransaction: MutationResolvers["splitTransaction"] = async (
  _,
  { id, splits }
) => {
  const transaction = transactionsRepo.get(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  if (sum(splits.map((split) => split.amount)) !== transaction.amount) {
    throw new Error("Transaction amounts do not match")
  }

  if (transaction.splitFromId) {
    throw new Error(`Transaction is already split from ${transaction.splitFromId}`)
  }

  transactionsRepo.deleteSplitTransactions(transaction.id)

  const { id: _id, ...transactionAttributes } = transaction

  splits.forEach((split) => {
    transactionsRepo.insert({
      ...transactionAttributes,
      splitFromId: transaction.id,
      amount: split.amount,
      memo: split.memo || transaction.memo
    })
  })

  return transaction
}

export const Transaction: Resolvers["Transaction"] = {
  id: (transaction) => transaction.id,

  amount: async (transaction, { currencyId }, context) =>
    convertCurrency({
      amount: transaction.amount,
      currency: await context.data.currency.load(transaction.currencyId),
      targetCurrencyId: currencyId,
      context
    }),

  date: (transaction) => transaction.date,
  memo: (transaction) => transaction.memo,
  originalMemo: (transaction) => transaction.originalMemo,
  includeInReports: (transaction) => transaction.includeInReports,

  currencyId: (transaction) => transaction.currencyId,
  currency: async (transaction, _, context) =>
    await context.data.currency.load(transaction.currencyId),

  categoryId: (transaction) => transaction.categoryId,
  category: async (transaction, _, context) =>
    transaction.categoryId ? await context.data.category.load(transaction.categoryId) : null,

  accountMailboxId: (transaction) => transaction.accountMailboxId,
  accountMailbox: async (transaction, _, context) =>
    await context.data.accountMailbox.load(transaction.accountMailboxId),

  splitFromId: (transaction) => transaction.splitFromId,
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

export const DailyTransactions: Resolvers["DailyTransactions"] = {
  date: (result) => result.date,

  totalSpent: async (result, { currencyId }, context) =>
    sumCurrency({
      amounts: await Promise.all(
        result.transactions.map(async (transaction) => ({
          amount: transaction.amount,
          currency: await context.data.currency.load(transaction.currencyId)
        }))
      ),
      targetCurrencyId: currencyId,
      context
    }),

  transactions: (result) => result.transactions
}
