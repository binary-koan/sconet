import { up } from "../../src/db/migrations/migrate"
import { runDbSession } from "../../src/utils/runDbSession"

runDbSession(() => up(process.argv[2]))
