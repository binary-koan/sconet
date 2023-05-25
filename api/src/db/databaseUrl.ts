let databaseUrl = Bun.env.DATABASE_URL!

if (Bun.env.ENV_TYPE === "test") {
  databaseUrl += "_test"
}

export { databaseUrl }
