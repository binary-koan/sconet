import { createDb } from "../src/db/createDb"
import { sql } from "../src/db/database"
import { createMigration, down, migrate, rollback, up } from "../src/db/migrate"
import { seed } from "../src/db/seeds/seed"
import { runJob } from "../src/job"
import { startServer } from "../src/server"

const commands: { [command: string]: ((...args: string[]) => void | Promise<void>) | undefined } = {
  server: () => startServer(),

  job: (jobName: string) => runJob(jobName),

  db_create: () => createDb(),

  migrate_create: (name: string) => createMigration(name),

  migrate: () => migrate(),

  migrate_rollback: () => rollback(),

  migrate_up: (version: string) => up(version),

  migrate_down: (version: string) => down(version),

  setup: async () => {
    await createDb()
    await migrate()
  },

  seed: () => seed()
}

const command = commands[process.argv[2]?.replace(/\W/g, "_")]

if (command) {
  try {
    await command(...process.argv.slice(3))
    await sql.end()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
} else {
  console.log(`Unknown command ${process.argv[2]}`)
}
