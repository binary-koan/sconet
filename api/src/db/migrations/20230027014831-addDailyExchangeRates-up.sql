CREATE TABLE "dailyExchangeRates" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "fromCurrencyId" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "exchangeRateValues" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "dailyExchangeRateId" TEXT NOT NULL,
  "toCurrencyId" TEXT NOT NULL,
  "rate" REAL NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

ALTER TABLE
  "transactions"
ADD
  COLUMN "dailyExchangeRateId" TEXT;