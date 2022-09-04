import { makeExecutableSchema } from "@graphql-tools/schema"
import { readdirSync, readFileSync } from "fs"
import { resolve } from "path"
import { Resolvers } from "./resolvers-types"
import {
  accountMailbox,
  accountMailboxes,
  createAccountMailbox,
  deleteAccountMailbox,
  updateAccountMailbox,
  AccountMailbox
} from "./resolvers/accountMailbox"
import {
  category,
  categories,
  createCategory,
  deleteCategory,
  updateCategory,
  reorderCategories,
  Category
} from "./resolvers/categories"
import {
  createTransaction,
  deleteTransaction,
  PaginatedTransactions,
  splitTransaction,
  Transaction,
  transaction,
  transactions,
  updateTransaction
} from "./resolvers/transaction"
import { budgets, CategoryBudget, MonthBudget } from "./resolvers/budgets"
import { CurrencyResolver, DateTimeResolver, JSONResolver } from "graphql-scalars"
import { applyAuthenticatedDirective } from "./resolvers/directives/authenticated"
import { login, changePassword, generateNewToken } from "./resolvers/sessions"
import {
  currencies,
  currency,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  Currency
} from "./resolvers/currencies"
import { Money } from "./resolvers/money"
import { GraphQLScalarType } from "graphql"

const resolvers: Resolvers = {
  Query: {
    transaction,
    transactions,
    accountMailbox,
    accountMailboxes,
    category,
    categories,
    budgets,
    currencies,
    currency
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
    generateNewToken
  },
  Transaction,
  PaginatedTransactions,
  Currency,
  Category,
  AccountMailbox,
  MonthBudget,
  CategoryBudget,
  Money,

  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  CurrencyCode: new GraphQLScalarType({ ...CurrencyResolver.toConfig(), name: "CurrencyCode" })
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
