## `accounts`

Columns
- `createdAt` timestamp without time zone
- `deletedAt` timestamp without time zone
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `accounts_pkey`
  - used in constraint: `fk_account`
- `name` text
- `updatedAt` timestamp without time zone

Indexes
- `accounts_pkey`

## `categories`

Columns
- `budget` integer
- `budgetCurrencyCode` text
- `color` text
- `createdAt` timestamp without time zone
- `deletedAt` timestamp without time zone
- `icon` text
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `categories_pkey`
  - used in constraint: `fk_category`
- `isRegular` boolean
- `name` text
- `sortOrder` integer
- `updatedAt` timestamp without time zone

Indexes
- `categories_pkey`

## `dailyExchangeRates`

Columns
- `createdAt` timestamp without time zone
- `date` date
- `deletedAt` timestamp without time zone
- `fromCurrencyCode` text
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `dailyExchangeRates_pkey`
  - used in constraint: `fk_dailyexchangerate`
- `updatedAt` timestamp without time zone

Indexes
- `dailyExchangeRates_pkey`

## `exchangeRateValues`

Columns
- `createdAt` timestamp without time zone
- `dailyExchangeRateId` uuid
- `deletedAt` timestamp without time zone
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `exchangeRateValues_pkey`
- `rate` real
- `toCurrencyCode` text
- `updatedAt` timestamp without time zone

Indexes
- `exchangeRateValues_pkey`

## `transactions`

Columns
- `accountId` uuid
- `amount` integer
- `categoryId` uuid
- `createdAt` timestamp without time zone
- `currencyCode` text
- `date` date
- `deletedAt` timestamp without time zone
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `transactions_pkey`
  - used in constraint: `fk_splitfrom`
- `includeInReports` boolean
- `memo` text
- `originalAmount` integer
- `originalCurrencyCode` text
- `splitFromId` uuid
- `updatedAt` timestamp without time zone

Indexes
- `transactions_pkey`
- `idx_memo`
- `idx_date`
- `idx_accountid`
- `idx_categoryid`
- `idx_splitfromid`

## `userCredentials`

Columns
- `counter` integer
- `createdAt` timestamp without time zone
- `credentialId` bytea
- `credentialPublicKey` bytea
- `deletedAt` timestamp without time zone
- `device` text
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `userCredentials_pkey`
- `updatedAt` timestamp without time zone
- `userId` uuid

Indexes
- `userCredentials_pkey`

## `users`

Columns
- `createdAt` timestamp without time zone
- `deletedAt` timestamp without time zone
- `email` text
- `encryptedPassword` text
- `id` uuid
  - default: `uuid_generate_v4()`
  - used in constraint: `users_pkey`
  - used in constraint: `fk_user`
- `settings` jsonb
- `updatedAt` timestamp without time zone
- `webauthnChallenge` text

Indexes
- `users_pkey`