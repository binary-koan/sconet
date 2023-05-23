import { makeExecutableSchema } from "@graphql-tools/schema"
import { GraphQLScalarType } from "graphql"
import {
  CurrencyResolver,
  DateResolver,
  DateTimeResolver,
  JSONResolver,
  UtcOffsetResolver
} from "graphql-scalars"
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
import {
  Currency,
  createCurrency,
  currencies,
  currency,
  deleteCurrency,
  updateCurrency
} from "./resolvers/currencies"
import {
  DailyExchangeRate,
  ExchangeRateValue,
  currentExchangeRates
} from "./resolvers/dailyExchangeRate"
import { applyAuthenticatedDirective } from "./resolvers/directives/authenticated"
import { Money } from "./resolvers/money"
import {
  CurrentUser,
  UserCredential,
  changePassword,
  currentUser,
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
    currencies,
    currency,
    currentUser,
    currentExchangeRates
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
    createCurrency,
    updateCurrency,
    deleteCurrency,
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
  DailyExchangeRate,
  ExchangeRateValue,
  MonthBudget,
  CategoryBudget,
  CategoryBudgetGroup,
  Money,
  CurrentUser,
  UserCredential,

  Date: DateResolver,
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  CurrencyCode: new GraphQLScalarType({ ...CurrencyResolver.toConfig(), name: "CurrencyCode" }),
  UtcOffset: UtcOffsetResolver
}

export const schema = applyAuthenticatedDirective(
  makeExecutableSchema({
    typeDefs,
    resolvers
  })
)
