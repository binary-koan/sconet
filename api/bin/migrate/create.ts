import { createMigration } from "../../src/db/migrations/migrate"

createMigration(process.argv[2])
