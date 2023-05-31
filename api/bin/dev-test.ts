import "../src/extraCurrencies"
import "../src/polyfills"

import { spawnSync } from "bun"
import path from "path"
import { createDb } from "../src/db/createDb"
import { dropDb } from "../src/db/dropDb"
import { migrate } from "../src/db/migrate"
import { seed } from "../src/db/seeds/seed"
import { startServer } from "../src/server"

await dropDb()
await createDb()
await migrate()
await seed({ users: true, accounts: true })

spawnSync(["bun", "run", "build"], {
  cwd: path.resolve(import.meta.dir, "../../web"),
  stdout: "inherit",
  stderr: "inherit"
})

const webPath = path.resolve(import.meta.dir, "../../web")

startServer([`${webPath}/build`, `${webPath}/public`])
