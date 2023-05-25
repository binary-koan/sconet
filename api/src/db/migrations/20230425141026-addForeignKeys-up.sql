ALTER TABLE
  "transactions"
ADD
  CONSTRAINT fk_category FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE
SET
  NULL;

ALTER TABLE
  "transactions"
ADD
  CONSTRAINT fk_account FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE;

ALTER TABLE
  "transactions"
ADD
  CONSTRAINT fk_splitfrom FOREIGN KEY ("splitFromId") REFERENCES "transactions" ("id") ON DELETE CASCADE;

ALTER TABLE
  "exchangeRateValues"
ADD
  CONSTRAINT fk_dailyexchangerate FOREIGN KEY ("dailyExchangeRateId") REFERENCES "dailyExchangeRates" ("id") ON DELETE CASCADE;

ALTER TABLE
  "userCredentials"
ADD
  CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE;