CREATE TABLE "dailyExchangeRates" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "fromCurrencyCode" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);

CREATE TABLE "exchangeRateValues" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "dailyExchangeRateId" UUID NOT NULL,
  "toCurrencyCode" TEXT NOT NULL,
  "rate" REAL NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);