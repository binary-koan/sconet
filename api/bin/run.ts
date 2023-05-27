import "../src/extraCurrencies"
import "../src/polyfills"

import { createDb } from "../src/db/createDb"
import { sql } from "../src/db/database"
import { createMigration, down, migrate, rollback, up, writeSchema } from "../src/db/migrate"
import { seed } from "../src/db/seeds/seed"
import { startBackupSchedule } from "../src/jobs/backup"
import { startServer } from "../src/server"

const commands: { [command: string]: ((...args: string[]) => void | Promise<void>) | undefined } = {
  server: () => startServer(),

  db_create: () => createDb(),

  migrate_create: (name: string) => createMigration(name),

  migrate: async () => {
    await migrate()
    await sql.end()
  },

  migrate_rollback: async () => {
    await rollback()
    await sql.end()
  },

  migrate_up: async (version: string) => {
    await up(version)
    await sql.end()
  },

  migrate_down: async (version: string) => {
    await down(version)
    await sql.end()
  },

  schema_write: async () => {
    await writeSchema()
    await sql.end()
  },

  setup: async () => {
    await createDb()
    await migrate()
    await sql.end()
  },

  seed: async () => {
    await seed()
    await sql.end()
  },

  setup_and_serve: async () => {
    await createDb()
    await migrate()
    startBackupSchedule()
    startServer()
  }
}

const command = commands[process.argv[2]?.replace(/\W/g, "_")]

if (command) {
  try {
    await command(...process.argv.slice(3))
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
} else {
  console.log(`Unknown command ${process.argv[2]}`)
}
