import postgres from "postgres"
import { databaseUrl } from "./databaseUrl"

export async function dropDb() {
  const uriWithoutDatabase = databaseUrl.replace(/\/[^/?]+$/, "/postgres")
  const databaseName = databaseUrl.replace(/.*\//, "").replace(/\?.*/, "")

  const rootSql = postgres(uriWithoutDatabase)

  if ((await rootSql`SELECT 1 FROM pg_database WHERE datname = ${databaseName}`).length) {
    console.log(`Dropping database ${databaseName}.`)
    await rootSql`DROP DATABASE ${rootSql(databaseName)}`
  } else {
    console.log(`Database ${databaseName} does not exist.`)
  }

  await rootSql.end()
}
