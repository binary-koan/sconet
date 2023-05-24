let databaseUri = process.env.POSTGRES_URI!

if (process.env.NODE_ENV === "test") {
  databaseUri += "_test"
}

export { databaseUri }
