import { down } from "../../src/db/migrations/migrate"
import { runDbSession } from "../../src/utils/runDbSession"

runDbSession(() => down(process.argv[2]))
