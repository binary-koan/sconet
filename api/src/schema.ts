import { makeExecutableSchema } from "@graphql-tools/schema"
import { readdirSync, readFileSync } from "fs"
import { resolve } from "path"
import { Resolvers } from "./resolvers-types"
import {
  accountMailbox,
  accountMailboxes,
  createAccountMailbox,
  deleteAccountMailbox,
  updateAccountMailbox
} from "./resolvers/accountMailbox"
import {
  category,
  categories,
  createCategory,
  deleteCategory,
  updateCategory
} from "./resolvers/categories"
import {
  createTransaction,
  deleteTransaction,
  splitTransaction,
  Transaction,
  transaction,
  transactions,
  updateTransaction
} from "./resolvers/transaction"

const resolvers: Resolvers = {
  Query: {
    transaction,
    transactions,
    accountMailbox,
    accountMailboxes,
    category,
    categories
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
    deleteCategory
  },
  Transaction
}

const graphqlDir = resolve(import.meta.dir, "graphql")

export const schema = makeExecutableSchema({
  typeDefs: readdirSync(graphqlDir).map((filename) =>
    new TextDecoder().decode(readFileSync(resolve(graphqlDir, filename)))
  ),
  resolvers
})
