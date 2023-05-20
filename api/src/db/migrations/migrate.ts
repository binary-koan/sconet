import fs from "fs"
import { orderBy } from "lodash"
import { sql } from "../database"

const FILENAME_PATTERN = /^(\d+)-(\w+)\.(js|ts)$/

export async function migrate() {
  await createMigrationsTable()

  const runMigrations = await getCompletedMigrations()
  const migrationsToRun = listMigrationFiles().filter(
    ({ version }) => !runMigrations.includes(version)
  )

  if (migrationsToRun.length) {
    for (const { filename, version, name } of migrationsToRun) {
      await runMigration(filename, version, name)
    }
  } else {
    console.log("Nothing to run")
  }
}

export async function rollback() {
  await createMigrationsTable()

  const runMigrations = await getCompletedMigrations()

  if (!runMigrations.length) {
    throw new Error("No migrations have been run")
  }

  const version = runMigrations[runMigrations.length - 1]
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error(`Migration file not found for ${version}`)
  }

  await rollbackMigration(filename, version, name)
}

export async function up(version: string) {
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error("No such version")
  }

  await runMigration(filename, version, name)
}

export async function down(version: string) {
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error("No such version")
  }

  await rollbackMigration(filename, version, name)
}

export function createMigration(name: string) {
  const now = new Date()
  const timestamp = [
    now.getFullYear(),
    now.getMonth().toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0")
  ].join("")

  fs.writeFileSync(
    `${import.meta.dir}/${timestamp}-${name}.ts`,
    `import { sql } from "../database"

export async function up() {
}

export async function down() {
}
`
  )
}

export async function isMigrationNeeded() {
  const versions = listMigrationFiles().map((file) => file.version)
  const runMigrations = await getCompletedMigrations()

  return versions.some((version) => !runMigrations.includes(version))
}

async function createMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS schemaMigrations (
      version TEXT PRIMARY KEY
    )
  `
}

async function runMigration(filename: string, version: string, name: string) {
  console.log(`Migration ${name} (${version}) ...`)

  require(`./${filename}`).up()

  await sql`INSERT INTO schemaMigrations (version) VALUES (${sql({ version })})`

  console.log("Complete")
}

async function rollbackMigration(filename: string, version: string, name: string) {
  console.log(`Rolling back ${name} (${version}) ...`)

  require(`./${filename}`).down()

  await sql`DELETE FROM schemaMigrations WHERE version = ${version}`

  console.log("Complete")
}

function listMigrationFiles() {
  return orderBy(fs.readdirSync(import.meta.dir))
    .map((filename) => {
      const [_, version, name] = FILENAME_PATTERN.exec(filename) || []

      if (!version || !name) return

      return { filename, version, name }
    })
    .filter(
      (
        value: { filename: string; version: string; name: string } | undefined
      ): value is { filename: string; version: string; name: string } => value !== undefined
    )
}

async function getCompletedMigrations() {
  return (await sql`SELECT * FROM schemaMigrations`).map((row) => row.version)
}
