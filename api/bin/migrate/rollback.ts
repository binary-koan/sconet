import { rollback } from "../../src/db/migrations/migrate"
import { runDbSession } from "../../src/utils/runDbSession"

runDbSession(rollback)
