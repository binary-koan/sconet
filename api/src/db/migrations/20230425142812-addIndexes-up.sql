CREATE INDEX idx_memo ON "transactions" ("memo");

CREATE INDEX idx_date ON "transactions" ("date");

CREATE INDEX idx_accountid ON "transactions" ("accountId");

CREATE INDEX idx_categoryid ON "transactions" ("categoryId");

CREATE INDEX idx_splitfromid ON "transactions" ("splitFromId");