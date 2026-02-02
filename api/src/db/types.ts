import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

// Common types
type Timestamp = ColumnType<Date, Date | string, Date | string>

// Users table
export interface UsersTable {
  id: Generated<string>
  email: string
  password_digest: string
  webauthn_challenge: string | null
  default_currency_id: string | null
  default_account_id: string | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type User = Selectable<UsersTable>
export type NewUser = Insertable<UsersTable>
export type UserUpdate = Updateable<UsersTable>

// Accounts table
export interface AccountsTable {
  id: Generated<string>
  name: string
  currency_id: string
  deleted_at: Timestamp | null
  archived_at: Timestamp | null
  favourite: Generated<boolean>
  sort_order: number
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type Account = Selectable<AccountsTable>
export type NewAccount = Insertable<AccountsTable>
export type AccountUpdate = Updateable<AccountsTable>

// Transactions table
export interface TransactionsTable {
  id: Generated<string>
  shop: Generated<string>
  memo: Generated<string>
  date: ColumnType<Date, Date | string, Date | string>
  include_in_reports: Generated<boolean>
  amount_cents: number | null
  currency_id: string | null
  shop_amount_cents: number | null
  shop_currency_id: string | null
  category_id: string | null
  account_id: string
  split_from_id: string | null
  deleted_at: Timestamp | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type Transaction = Selectable<TransactionsTable>
export type NewTransaction = Insertable<TransactionsTable>
export type TransactionUpdate = Updateable<TransactionsTable>

// Categories table
export interface CategoriesTable {
  id: Generated<string>
  name: string
  color: string
  icon: string
  emoji: string | null
  regular: Generated<boolean>
  sort_order: number
  deleted_at: Timestamp | null
  archived_at: Timestamp | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type Category = Selectable<CategoriesTable>
export type NewCategory = Insertable<CategoriesTable>
export type CategoryUpdate = Updateable<CategoriesTable>

// Currencies table
export interface CurrenciesTable {
  id: Generated<string>
  code: string
  name: string
  symbol: string
  decimal_digits: number
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type Currency = Selectable<CurrenciesTable>
export type NewCurrency = Insertable<CurrenciesTable>
export type CurrencyUpdate = Updateable<CurrenciesTable>

// Category budgets table
export interface CategoryBudgetsTable {
  id: Generated<string>
  category_id: string
  date_from: ColumnType<Date, Date | string, Date | string>
  date_to: ColumnType<Date, Date | string, Date | string> | null
  budget_cents: number
  currency_id: string
  deleted_at: Timestamp | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type CategoryBudget = Selectable<CategoryBudgetsTable>
export type NewCategoryBudget = Insertable<CategoryBudgetsTable>
export type CategoryBudgetUpdate = Updateable<CategoryBudgetsTable>

// Exchange rate values table
export interface ExchangeRateValuesTable {
  id: Generated<string>
  date: ColumnType<Date, Date | string, Date | string>
  from_currency_id: string
  to_currency_id: string
  rate: string // decimal stored as string for precision
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type ExchangeRateValue = Selectable<ExchangeRateValuesTable>
export type NewExchangeRateValue = Insertable<ExchangeRateValuesTable>
export type ExchangeRateValueUpdate = Updateable<ExchangeRateValuesTable>

// User credentials table (WebAuthn)
export interface UserCredentialsTable {
  id: Generated<string>
  user_id: string
  device: string
  credential_id: Buffer
  credential_public_key: Buffer
  counter: Generated<number>
  deleted_at: Timestamp | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type UserCredential = Selectable<UserCredentialsTable>
export type NewUserCredential = Insertable<UserCredentialsTable>
export type UserCredentialUpdate = Updateable<UserCredentialsTable>

// User currency favourites table
export interface UserCurrencyFavouritesTable {
  id: Generated<string>
  user_id: string
  currency_id: string
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type UserCurrencyFavourite = Selectable<UserCurrencyFavouritesTable>
export type NewUserCurrencyFavourite = Insertable<UserCurrencyFavouritesTable>
export type UserCurrencyFavouriteUpdate = Updateable<UserCurrencyFavouritesTable>

// Favourite transactions table
export interface FavouriteTransactionsTable {
  id: Generated<string>
  user_id: string
  name: string
  shop: Generated<string>
  memo: Generated<string>
  price_cents: number | null
  account_id: string | null
  category_id: string | null
  created_at: Generated<Timestamp>
  updated_at: Timestamp
}

export type FavouriteTransaction = Selectable<FavouriteTransactionsTable>
export type NewFavouriteTransaction = Insertable<FavouriteTransactionsTable>
export type FavouriteTransactionUpdate = Updateable<FavouriteTransactionsTable>

// Active Storage tables (Rails Active Storage)
export interface ActiveStorageBlobsTable {
  id: Generated<number>
  key: string
  filename: string
  content_type: string | null
  metadata: string | null
  service_name: string
  byte_size: number
  checksum: string | null
  created_at: Generated<Timestamp>
}

export type ActiveStorageBlob = Selectable<ActiveStorageBlobsTable>
export type NewActiveStorageBlob = Insertable<ActiveStorageBlobsTable>
export type ActiveStorageBlobUpdate = Updateable<ActiveStorageBlobsTable>

export interface ActiveStorageAttachmentsTable {
  id: Generated<number>
  name: string
  record_type: string
  record_id: number
  blob_id: number
  created_at: Generated<Timestamp>
}

export type ActiveStorageAttachment = Selectable<ActiveStorageAttachmentsTable>
export type NewActiveStorageAttachment = Insertable<ActiveStorageAttachmentsTable>
export type ActiveStorageAttachmentUpdate = Updateable<ActiveStorageAttachmentsTable>

export interface ActiveStorageVariantRecordsTable {
  id: Generated<number>
  blob_id: number
  variation_digest: string
}

export type ActiveStorageVariantRecord = Selectable<ActiveStorageVariantRecordsTable>
export type NewActiveStorageVariantRecord = Insertable<ActiveStorageVariantRecordsTable>
export type ActiveStorageVariantRecordUpdate = Updateable<ActiveStorageVariantRecordsTable>

// Database schema
export interface Database {
  users: UsersTable
  accounts: AccountsTable
  transactions: TransactionsTable
  categories: CategoriesTable
  currencies: CurrenciesTable
  category_budgets: CategoryBudgetsTable
  exchange_rate_values: ExchangeRateValuesTable
  user_credentials: UserCredentialsTable
  user_currency_favourites: UserCurrencyFavouritesTable
  favourite_transactions: FavouriteTransactionsTable
  active_storage_blobs: ActiveStorageBlobsTable
  active_storage_attachments: ActiveStorageAttachmentsTable
  active_storage_variant_records: ActiveStorageVariantRecordsTable
}
