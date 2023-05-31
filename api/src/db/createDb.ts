import postgres from "postgres"
import { databaseUrl } from "./databaseUrl"

export async function createDb() {
  const uriWithoutDatabase = databaseUrl.replace(/\/[^/?]+$/, "/postgres")
  const databaseName = databaseUrl.replace(/.*\//, "").replace(/\?.*/, "")
  const rootSql = postgres(uriWithoutDatabase)

  if ((await rootSql`SELECT 1 FROM pg_database WHERE datname = ${databaseName}`).length) {
    console.log(`Database ${databaseName} already exists.`)
  } else {
    console.log(`Creating database ${databaseName}.`)
    await rootSql`CREATE DATABASE ${rootSql(databaseName)}`
  }

  await rootSql.end()

  const dbSql = postgres(databaseUrl)

  await dbSql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

  if (Bun.env.PG_STAT_STATEMENTS) {
    await dbSql`CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"`
  }

  await dbSql.end()
}
