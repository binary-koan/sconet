ALTER TABLE
  "transactions"
ADD
  COLUMN "originalAmount" INTEGER;

ALTER TABLE
  "transactions"
ADD
  COLUMN "originalCurrencyCode" TEXT;