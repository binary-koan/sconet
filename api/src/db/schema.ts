import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  date,
  bigint,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  passwordDigest: text("password_digest").notNull(),
  webauthnChallenge: text("webauthn_challenge"),
  defaultCurrencyId: uuid("default_currency_id"),
  defaultAccountId: uuid("default_account_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  defaultCurrency: one(currencies, {
    fields: [users.defaultCurrencyId],
    references: [currencies.id],
  }),
  defaultAccount: one(accounts, {
    fields: [users.defaultAccountId],
    references: [accounts.id],
  }),
  credentials: many(userCredentials),
  currencyFavourites: many(userCurrencyFavourites),
  favouriteTransactions: many(favouriteTransactions),
}))

// Accounts table
export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  currencyId: uuid("currency_id").notNull(),
  deletedAt: timestamp("deleted_at"),
  archivedAt: timestamp("archived_at"),
  favourite: boolean("favourite").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [accounts.currencyId],
    references: [currencies.id],
  }),
  transactions: many(transactions),
}))

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  shop: text("shop").notNull().default(""),
  memo: text("memo").notNull().default(""),
  date: date("date", { mode: "date" }).notNull(),
  includeInReports: boolean("include_in_reports").notNull().default(true),
  amountCents: integer("amount_cents"),
  currencyId: uuid("currency_id"),
  shopAmountCents: integer("shop_amount_cents"),
  shopCurrencyId: uuid("shop_currency_id"),
  categoryId: uuid("category_id"),
  accountId: uuid("account_id").notNull(),
  splitFromId: uuid("split_from_id"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  currency: one(currencies, {
    fields: [transactions.currencyId],
    references: [currencies.id],
    relationName: "transactionCurrency",
  }),
  shopCurrency: one(currencies, {
    fields: [transactions.shopCurrencyId],
    references: [currencies.id],
    relationName: "transactionShopCurrency",
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  splitFrom: one(transactions, {
    fields: [transactions.splitFromId],
    references: [transactions.id],
    relationName: "transactionSplits",
  }),
  splitTo: many(transactions, { relationName: "transactionSplits" }),
}))

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  emoji: text("emoji"),
  regular: boolean("regular").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
  deletedAt: timestamp("deleted_at"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  budgets: many(categoryBudgets),
}))

// Currencies table
export const currencies = pgTable("currencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimalDigits: integer("decimal_digits").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const currenciesRelations = relations(currencies, ({ many }) => ({
  accounts: many(accounts),
  transactionsAsCurrency: many(transactions, { relationName: "transactionCurrency" }),
  transactionsAsShopCurrency: many(transactions, { relationName: "transactionShopCurrency" }),
  budgets: many(categoryBudgets),
}))

// Category budgets table
export const categoryBudgets = pgTable("category_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").notNull(),
  dateFrom: date("date_from", { mode: "date" }).notNull(),
  dateTo: date("date_to", { mode: "date" }),
  budgetCents: integer("budget_cents").notNull(),
  currencyId: uuid("currency_id").notNull(),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const categoryBudgetsRelations = relations(categoryBudgets, ({ one }) => ({
  category: one(categories, {
    fields: [categoryBudgets.categoryId],
    references: [categories.id],
  }),
  currency: one(currencies, {
    fields: [categoryBudgets.currencyId],
    references: [currencies.id],
  }),
}))

// Exchange rate values table
export const exchangeRateValues = pgTable("exchange_rate_values", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date", { mode: "date" }).notNull(),
  fromCurrencyId: uuid("from_currency_id").notNull(),
  toCurrencyId: uuid("to_currency_id").notNull(),
  rate: text("rate").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const exchangeRateValuesRelations = relations(exchangeRateValues, ({ one }) => ({
  fromCurrency: one(currencies, {
    fields: [exchangeRateValues.fromCurrencyId],
    references: [currencies.id],
  }),
  toCurrency: one(currencies, {
    fields: [exchangeRateValues.toCurrencyId],
    references: [currencies.id],
  }),
}))

// User credentials table (WebAuthn)
export const userCredentials = pgTable("user_credentials", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  device: text("device").notNull(),
  credentialId: text("credential_id").notNull(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
  user: one(users, {
    fields: [userCredentials.userId],
    references: [users.id],
  }),
}))

// User currency favourites table
export const userCurrencyFavourites = pgTable("user_currency_favourites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  currencyId: uuid("currency_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const userCurrencyFavouritesRelations = relations(userCurrencyFavourites, ({ one }) => ({
  user: one(users, {
    fields: [userCurrencyFavourites.userId],
    references: [users.id],
  }),
  currency: one(currencies, {
    fields: [userCurrencyFavourites.currencyId],
    references: [currencies.id],
  }),
}))

// Favourite transactions table
export const favouriteTransactions = pgTable("favourite_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  shop: text("shop").notNull().default(""),
  memo: text("memo").notNull().default(""),
  priceCents: integer("price_cents"),
  accountId: uuid("account_id"),
  categoryId: uuid("category_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const favouriteTransactionsRelations = relations(favouriteTransactions, ({ one }) => ({
  user: one(users, {
    fields: [favouriteTransactions.userId],
    references: [users.id],
  }),
  account: one(accounts, {
    fields: [favouriteTransactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [favouriteTransactions.categoryId],
    references: [categories.id],
  }),
}))

// Active Storage tables (Rails Active Storage)
export const activeStorageBlobs = pgTable("active_storage_blobs", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  key: text("key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type"),
  metadata: text("metadata"),
  serviceName: text("service_name").notNull(),
  byteSize: bigint("byte_size", { mode: "number" }).notNull(),
  checksum: text("checksum"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const activeStorageAttachments = pgTable("active_storage_attachments", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  recordType: text("record_type").notNull(),
  recordId: bigint("record_id", { mode: "number" }).notNull(),
  blobId: bigint("blob_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const activeStorageVariantRecords = pgTable("active_storage_variant_records", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  blobId: bigint("blob_id", { mode: "number" }).notNull(),
  variationDigest: text("variation_digest").notNull(),
})
