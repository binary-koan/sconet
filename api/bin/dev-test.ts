import "../src/extraCurrencies"
import "../src/polyfills"

import { spawnSync } from "bun"
import path from "path"
import { createDb } from "../src/db/createDb"
import { db } from "../src/db/database"
import { dropDb } from "../src/db/dropDb"
import { migrate } from "../src/db/migrate"
import { seed } from "../src/db/seeds/seed"
import { startServer } from "../src/server"

if (process.argv[2] === "resetdb") {
  const tableNames = (
    await db.sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`
  )
    .filter(({ tablename }) => tablename !== "users")
    .map(({ tablename }) => tablename)

  for (const tableName of tableNames) {
    await db.sql`DELETE FROM ${db.sql(tableName)}`
  }

  await seed({ accounts: true })

  const [account] = await db.sql`SELECT * FROM "accounts"`

  for (const user of await db.sql`SELECT * FROM "users"`) {
    await db.sql`UPDATE "users" SET ${db.sql({
      settings: { ...user.settings, defaultAccountId: account.id }
    })}`
  }

  await db.sql.end()
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
