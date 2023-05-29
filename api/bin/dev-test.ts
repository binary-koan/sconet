import "../src/extraCurrencies"
import "../src/polyfills"

import path from "path"
import { createDb } from "../src/db/createDb"
import { migrate } from "../src/db/migrate"
import { startServer } from "../src/server"

await createDb()
await migrate()

const webPath = path.resolve(import.meta.dir, "../../web")

startServer([`${webPath}/build`, `${webPath}/public`])
