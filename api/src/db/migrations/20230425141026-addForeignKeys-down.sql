ALTER TABLE
  "transactions" DROP CONSTRAINT "fk_category";

ALTER TABLE
  "transactions" DROP CONSTRAINT "fk_account";

ALTER TABLE
  "transactions" DROP CONSTRAINT "fk_splitfrom";

ALTER TABLE
  "exchangeRateValues" DROP CONSTRAINT "fk_dailyexchangerate";

ALTER TABLE
  "userCredentials" DROP CONSTRAINT "fk_user";