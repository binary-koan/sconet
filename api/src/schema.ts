import { makeExecutableSchema } from "@graphql-tools/schema"
import { DateResolver, DateTimeResolver, JSONResolver, UtcOffsetResolver } from "graphql-scalars"
import { Resolvers } from "./resolvers-types"
import {
  Account,
  account,
  accounts,
  createAccount,
  deleteAccount,
  updateAccount
} from "./resolvers/accounts"
import { CategoryBudget, CategoryBudgetGroup, MonthBudget, budget } from "./resolvers/budgets"
import {
  Category,
  categories,
  category,
  createCategory,
  deleteCategory,
  reorderCategories,
  updateCategory
} from "./resolvers/categories"
import { Currency, currencies, currency } from "./resolvers/currencies"
import { applyAuthenticatedDirective } from "./resolvers/directives/authenticated"
import { Money } from "./resolvers/money"
import {
  changePassword,
  deleteCredential,
  generateCredentialLoginOptions,
  generateNewToken,
  login,
  loginViaCredential,
  registerCredential,
  verifyCredentialRegistration
} from "./resolvers/sessions"
import {
  DailyTransactions,
  PaginatedTransactions,
  Transaction,
  createTransaction,
  deleteTransaction,
  splitTransaction,
  transaction,
  transactions,
  transactionsByDay,
  updateTransaction
} from "./resolvers/transactions"

import { AnnualBalance, MonthBalance, balance } from "./resolvers/balance"
import {
  CurrentUser,
  UserCredential,
  currentUser,
  favoriteCurrency,
  setDefaultAccount,
  setDefaultCurrency,
  unfavoriteCurrency
} from "./resolvers/currentUser"
import { CurrencyCode } from "./resolvers/scalars/currencyCode"
import { PastDate } from "./resolvers/scalars/pastDate"
import { typeDefs } from "./schema-definitions"

const resolvers: Resolvers = {
  Query: {
    transaction,
    transactions,
    transactionsByDay,
    account,
    accounts,
    category,
    categories,
    budget,
    balance,
    currencies,
    currency,
    currentUser
  },
  Mutation: {
    createTransaction,
    updateTransaction,
    deleteTransaction,
    splitTransaction,
    createAccount,
    updateAccount,
    deleteAccount,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    favoriteCurrency,
    unfavoriteCurrency,
    setDefaultCurrency,
    setDefaultAccount,
    login,
    changePassword,
    generateNewToken,
    registerCredential,
    verifyCredentialRegistration,
    generateCredentialLoginOptions,
    loginViaCredential,
    deleteCredential
  },
  Transaction,
  PaginatedTransactions,
  DailyTransactions,
  Currency,
  Category,
  Account,
  MonthBudget,
  CategoryBudget,
  CategoryBudgetGroup,
  AnnualBalance,
  MonthBalance,
  Money,
  CurrentUser,
  UserCredential,

  Date: DateResolver,
  PastDate,
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  CurrencyCode,
  UtcOffset: UtcOffsetResolver
}

export const schema = applyAuthenticatedDirective(
  makeExecutableSchema({
    typeDefs,
    resolvers
  })
)
