import { omit, pick, sum } from "lodash"
import { Currencies } from "ts-money"
import { sql } from "../db/database"
import { TransactionRecord } from "../db/records/transaction"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
  UpdateTransactionInput
} from "../resolvers-types"
import {
  loadTransactionCurrencyValue,
  loadTransactionCurrencyValues
} from "../utils/currencyValuesLoader"
import { moneySum } from "../utils/money"

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

  const date = new Date(dateFrom)

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
    originalAmount: updateInput.originalAmount ?? undefined,
    originalCurrencyCode: updateInput.originalCurrencyCode ?? undefined,
    date: updateInput.date ?? undefined,
    includeInReports: updateInput.includeInReports ?? undefined,
    accountId: updateInput.accountId ?? undefined
  }

  if (
    updates.amount === updates.originalAmount &&
    updates.currencyCode === updates.originalCurrencyCode
  ) {
    updates.originalAmount = undefined
    updates.originalCurrencyCode = undefined
  }

  const updatedTransaction = await transactionsRepo.updateOne(id, updates)

  if (updates.amount !== undefined && updates.amount !== transaction.amount) {
    await transactionsRepo.deleteSplitTransactions(id)
  } else {
    await transactionsRepo.updateSplitTransactions(
      id,
      pick(updates, ...parentAttributes, "includeInReports")
    )
  }

  return updatedTransaction
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

  await sql.begin(async (sql) => {
    for (const split of splits) {
      await transactionsRepo.insert(
        {
          ...omit(transaction, "id"),
          splitFromId: transaction.id,
          amount: split.amount,
          memo: split.memo || transaction.memo,
          categoryId: split.categoryId
        },
        sql
      )
    }
  })

  return transaction
}

export const Transaction: Resolvers["Transaction"] = {
  id: (transaction) => transaction.id,

  date: (transaction) => transaction.date,
  memo: (transaction) => transaction.memo,
  includeInReports: (transaction) => transaction.includeInReports,

  amount: async (transaction, { currencyCode }, context) =>
    loadTransactionCurrencyValue(transaction, currencyCode, context.data.currencyValues),
  currencyCode: (transaction) => transaction.currencyCode,
  currency: async (transaction) => Currencies[transaction.currencyCode],

  originalAmount: async (transaction, { currencyCode }, context) =>
    transaction.originalAmount
      ? loadTransactionCurrencyValue(
          transaction,
          currencyCode,
          context.data.currencyValues,
          "originalAmount"
        )
      : null,
  originalCurrencyCode: (transaction) => transaction.originalCurrencyCode,
  originalCurrency: async (transaction) =>
    transaction.originalCurrencyCode ? Currencies[transaction.originalCurrencyCode] : null,

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
  totalCount: (result) => result.totalCount,
  totalAmount: async (result, { currencyCode }, context) =>
    moneySum(
      await loadTransactionCurrencyValues(
        await result.data,
        currencyCode || context.currentUser!.settings.defaultCurrencyCode,
        context.data.currencyValues
      ),
      Currencies[currencyCode || context.currentUser!.settings.defaultCurrencyCode]
    )
}

export const DailyTransactions: Resolvers["DailyTransactions"] = {
  date: (result) => result.date,

  totalSpent: async (result, { currencyCode }, context) =>
    moneySum(
      await loadTransactionCurrencyValues(
        result.transactions,
        currencyCode || context.currentUser!.settings.defaultCurrencyCode,
        context.data.currencyValues
      ),
      Currencies[currencyCode || context.currentUser!.settings.defaultCurrencyCode]
    ),
  transactions: (result) => result.transactions
}
