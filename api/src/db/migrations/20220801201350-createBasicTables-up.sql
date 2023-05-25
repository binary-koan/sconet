CREATE TABLE "accounts" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "categories" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "name" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "isRegular" BOOLEAN NOT NULL,
  "budget" INTEGER,
  "sortOrder" INTEGER,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "transactions" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "memo" TEXT NOT NULL,
  "originalMemo" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "includeInReports" INTEGER NOT NULL,
  "currencyId" TEXT NOT NULL,
  "categoryId" TEXT,
  "accountId" TEXT NOT NULL,
  "remoteId" TEXT,
  "splitFromId" TEXT,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  "deletedAt" TIMESTAMP
);

CREATE TABLE "users" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "email" TEXT NOT NULL,
  "encryptedPassword" TEXT NOT NULL,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "currencies" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "code" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "decimalDigits" INTEGER NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "exchangeRates" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "fromCurrencyId" TEXT NOT NULL,
  "toCurrencyId" TEXT NOT NULL,
  "rate" REAL NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);