import { omit, pick, sum } from "lodash"
import { Currencies, Money } from "ts-money"
import { TransactionRecord } from "../db/records/transaction"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UpdateTransactionInput
} from "../resolvers-types"
import { loadTransactionCurrencyValue } from "../utils/currencyValuesLoader"
import { sumCurrency } from "./money"

export interface DailyTransactionsResult {
  date: Date
  transactions: TransactionRecord[]
}

export const transactions: QueryResolvers["transactions"] = (_, { limit, offset, filter }) => {
  return transactionsRepo.filter({ limit, offset, filter })
}

export const transactionsByDay: QueryResolvers["transactionsByDay"] = async (
  _,
  { dateFrom, dateUntil }
) => {
  const transactions = await transactionsRepo.filter({ filter: { dateFrom, dateUntil } }).data

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

export const transaction: QueryResolvers["transaction"] = async (_, { id }) => {
  return (await transactionsRepo.get(id)) || null
}

export const createTransaction: MutationResolvers["createTransaction"] = async (_, { input }) => {
  return await transactionsRepo.insert({
    ...input,
    date: input.date || new Date(),
    includeInReports: input.includeInReports || true,
    originalMemo: input.memo,
    splitFromId: null
  })
}

export const updateTransaction: MutationResolvers["updateTransaction"] = async (
  _,
  { id, input }
) => {
  const transaction = await transactionsRepo.get(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  const parentAttributes = ["date", "accountId", "currencyCode"]

  let updateInput: Partial<UpdateTransactionInput> = input
  if (transaction.splitFromId) {
    updateInput = omit(input, parentAttributes)
  }

  const updates: Partial<TransactionRecord> = {
    ...updateInput,
    memo: updateInput.memo ?? undefined,
    amount: updateInput.amount ?? undefined,
    currencyCode: updateInput.currencyCode ?? undefined,
    date: updateInput.date ?? undefined,
    includeInReports: updateInput.includeInReports ?? undefined,
    accountId: updateInput.accountId ?? undefined
  }

  await transactionsRepo.updateOne(id, updates)
  await transactionsRepo.updateSplitTransactions(
    id,
    pick(updates, ...parentAttributes, "includeInReports")
  )

  return (await transactionsRepo.get(id))!
}

export const deleteTransaction: MutationResolvers["deleteTransaction"] = async (_, { id }) => {
  const transaction = await transactionsRepo.get(id)

  if (!transaction) {
    throw new Error("Not found")
  }

  await transactionsRepo.softDelete(id)
  await transactionsRepo.softDeleteSplitTransactions(id)

  return transaction
}

export const splitTransaction: MutationResolvers["splitTransaction"] = async (
  _,
  { id, splits }
) => {
  const transaction = await transactionsRepo.get(id)

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

  await Promise.all(
    splits.map((split) => {
      transactionsRepo.insert({
        ...transactionAttributes,
        splitFromId: transaction.id,
        amount: split.amount,
        memo: split.memo || transaction.memo
      })
    })
  )

  return transaction
}

export const Transaction: Resolvers["Transaction"] = {
  id: (transaction) => transaction.id,

  amount: async (transaction, { currencyCode }, context) =>
    loadTransactionCurrencyValue(transaction, currencyCode, context.data.currencyValues),

  date: (transaction) => transaction.date,
  memo: (transaction) => transaction.memo,
  originalMemo: (transaction) => transaction.originalMemo,
  includeInReports: (transaction) => transaction.includeInReports,

  currencyCode: (transaction) => transaction.currencyCode,
  currency: async (transaction) => Currencies[transaction.currencyCode],

  categoryId: (transaction) => transaction.categoryId,
  category: async (transaction, _, context) =>
    transaction.categoryId ? await context.data.category.load(transaction.categoryId) : null,

  accountId: (transaction) => transaction.accountId,
  account: async (transaction, _, context) =>
    await context.data.account.load(transaction.accountId),

  splitFromId: (transaction) => transaction.splitFromId,
  splitFrom: async (transaction, _, context) =>
    transaction.splitFromId ? await context.data.transaction.load(transaction.splitFromId) : null,

  splitTo: async (transaction, _, context) =>
    await context.data.transactionSplitTo.load(transaction.id)
}

export const PaginatedTransactions: Resolvers["PaginatedTransactions"] = {
  data: (result) => result.data,
  nextOffset: async (result) => (await result.nextOffset) || null,
  totalCount: (result) => result.totalCount
}

export const DailyTransactions: Resolvers["DailyTransactions"] = {
  date: (result) => result.date,

  totalSpent: async (result, { currencyCode }, context) =>
    sumCurrency({
      amounts: await Promise.all(
        result.transactions.map(
          async (transaction) => new Money(transaction.amount, transaction.currencyCode)
        )
      ),
      target: currencyCode ? { currencyCode, date: result.date } : undefined,
      context
    }),

  transactions: (result) => result.transactions
}
