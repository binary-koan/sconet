ALTER TABLE
  "accounts"
ADD
  COLUMN "currencyCode" TEXT;

UPDATE
  "accounts"
SET
  "currencyCode" = 'USD'
WHERE
  "currencyCode" IS NULL;

ALTER TABLE
  "accounts"
ALTER COLUMN
  "currencyCode"
SET
  NOT NULL;