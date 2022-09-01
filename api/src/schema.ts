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
import { DateTimeResolver, JSONResolver } from "graphql-scalars"
import { applyAuthenticatedDirective } from "./resolvers/directives/authenticated"
import { login, changePassword, generateNewToken } from "./resolvers/sessions"

const resolvers: Resolvers = {
  Query: {
    transaction,
    transactions,
    accountMailbox,
    accountMailboxes,
    category,
    categories,
    budgets
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
    login,
    changePassword,
    generateNewToken
  },
  Transaction,
  PaginatedTransactions,
  Category,
  AccountMailbox,
  MonthBudget,
  CategoryBudget,

  DateTime: DateTimeResolver,
  JSON: JSONResolver
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
