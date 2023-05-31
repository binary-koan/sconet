import "../src/extraCurrencies"
import "../src/polyfills"

import { spawnSync } from "bun"
import path from "path"
import { createDb } from "../src/db/createDb"
import { sql } from "../src/db/database"
import { dropDb } from "../src/db/dropDb"
import { migrate } from "../src/db/migrate"
import { seed } from "../src/db/seeds/seed"
import { startServer } from "../src/server"

if (process.argv[2] === "resetdb") {
  const tableNames = (
    await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`
  )
    .filter(({ tablename }) => tablename !== "users")
    .map(({ tablename }) => tablename)

  for (const tableName of tableNames) {
    await sql`DELETE FROM ${sql(tableName)}`
  }

  await seed({ accounts: true })

  const [account] = await sql`SELECT * FROM "accounts"`

  for (const user of await sql`SELECT * FROM "users"`) {
    await sql`UPDATE "users" SET ${sql({
      settings: { ...user.settings, defaultAccountId: account.id }
    })}`
  }

  await sql.end()
} else {
  await dropDb()
  await createDb()
  await migrate()
  await seed({ users: true })

  spawnSync(["bun", "run", "build"], {
    cwd: path.resolve(import.meta.dir, "../../web"),
    stdout: "inherit",
    stderr: "inherit"
  })

  const webPath = path.resolve(import.meta.dir, "../../web")

  startServer([`${webPath}/build`, `${webPath}/public`])
}
