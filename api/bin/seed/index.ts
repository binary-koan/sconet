import { seed } from "../../src/db/seeds/seed"
import { runDbSession } from "../../src/utils/runDbSession"

runDbSession(seed)
