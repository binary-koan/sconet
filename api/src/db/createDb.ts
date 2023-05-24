import postgres from "postgres"
import { databaseUri } from "./databaseUri"

export async function createDb() {
  const uriWithoutDatabase = databaseUri.replace(/\/[^/]+$/, "/postgres")
  const databaseName = databaseUri.replace(/.*\//, "")
  const rootSql = postgres(uriWithoutDatabase)

  if ((await rootSql`SELECT 1 FROM pg_database WHERE datname = ${databaseName}`).length) {
    console.log(`Database ${databaseName} already exists.`)
  } else {
    console.log(`Creating database ${databaseName}.`)
    await rootSql`CREATE DATABASE ${rootSql(databaseName)}`
  }

  await rootSql.end()

  const dbSql = postgres(databaseUri)

  await dbSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  if (process.env.NODE_ENV !== "production") {
    await dbSql`CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"`
  }

  await dbSql.end()
}
