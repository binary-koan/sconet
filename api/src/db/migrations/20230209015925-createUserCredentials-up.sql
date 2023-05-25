CREATE TABLE "userCredentials" (
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "userId" UUID NOT NULL,
  "device" TEXT NOT NULL,
  "credentialId" BYTEA NOT NULL,
  "credentialPublicKey" BYTEA NOT NULL,
  "counter" INTEGER NOT NULL,
  "deletedAt" TIMESTAMP,
  "createdAt" TIMESTAMP,
  "updatedAt" TIMESTAMP
);