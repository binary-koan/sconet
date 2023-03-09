import { makeExecutableSchema } from "@graphql-tools/schema"
import { readdirSync, readFileSync } from "fs"
import { GraphQLScalarType } from "graphql"
import {
  CurrencyResolver,
  DateResolver,
  DateTimeResolver,
  JSONResolver,
  UtcOffsetResolver
} from "graphql-scalars"
import { resolve } from "path"
import { Resolvers } from "./resolvers-types"
import {
  accountMailbox,
  AccountMailbox,
  accountMailboxes,
  createAccountMailbox,
  deleteAccountMailbox,
  updateAccountMailbox
} from "./resolvers/accountMailboxes"
import { budget, CategoryBudget, CategoryBudgetGroup, MonthBudget } from "./resolvers/budgets"
import {
  categories,
  category,
  Category,
  createCategory,
  deleteCategory,
  reorderCategories,
  updateCategory
} from "./resolvers/categories"
import {
  createCurrency,
  currencies,
  currency,
  Currency,
  deleteCurrency,
  updateCurrency
} from "./resolvers/currencies"
import {
  currentExchangeRates,
  DailyExchangeRate,
  ExchangeRateValue
} from "./resolvers/dailyExchangeRate"
import { applyAuthenticatedDirective } from "./resolvers/directives/authenticated"
import { Money } from "./resolvers/money"
import {
  changePassword,
  currentUser,
  CurrentUser,
  deleteCredential,
  generateCredentialLoginOptions,
  generateNewToken,
  login,
  loginViaCredential,
  registerCredential,
  UserCredential,
  verifyCredentialRegistration
} from "./resolvers/sessions"
import {
  createTransaction,
  DailyTransactions,
  deleteTransaction,
  PaginatedTransactions,
  splitTransaction,
  Transaction,
  transaction,
  transactions,
  transactionsByDay,
  updateTransaction
} from "./resolvers/transactions"

const resolvers: Resolvers = {
  Query: {
    transaction,
    transactions,
    transactionsByDay,
    accountMailbox,
    accountMailboxes,
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
    createAccountMailbox,
    updateAccountMailbox,
    deleteAccountMailbox,
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
  AccountMailbox,
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

const graphqlDir = resolve(import.meta.dir, "graphql")

export const schema = applyAuthenticatedDirective(
  makeExecutableSchema({
    typeDefs: readdirSync(graphqlDir).map((filename) =>
      new TextDecoder().decode(readFileSync(resolve(graphqlDir, filename)))
    ),
    resolvers
  })
)
