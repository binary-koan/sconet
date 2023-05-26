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
  "date" DATE NOT NULL,
  "includeInReports" BOOLEAN NOT NULL,
  "amount" INTEGER NOT NULL,
  "currencyCode" TEXT NOT NULL,
  "categoryId" UUID,
  "accountId" UUID NOT NULL,
  "splitFromId" UUID,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  "deletedAt" TIMESTAMP
);

CREATE TABLE "users" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "email" TEXT NOT NULL,
  "encryptedPassword" TEXT NOT NULL,
  "settings" JSONB NOT NULL,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP,
  "deletedAt" TIMESTAMP
);