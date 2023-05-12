import fs from "fs"
import { orderBy } from "lodash"
import { db } from "../database"

const FILENAME_PATTERN = /^(\d+)-(\w+)\.(js|ts)$/

export function migrate() {
  createMigrationsTable()

  const runMigrations = getCompletedMigrations()
  const migrationsToRun = listMigrationFiles().filter(
    ({ version }) => !runMigrations.includes(version)
  )

  if (migrationsToRun.length) {
    migrationsToRun.forEach(({ filename, version, name }) => runMigration(filename, version, name))
  } else {
    console.log("Nothing to run")
  }
}

export function rollback() {
  createMigrationsTable()

  const runMigrations = getCompletedMigrations()

  if (!runMigrations.length) {
    throw new Error("No migrations have been run")
  }

  const version = runMigrations[runMigrations.length - 1]
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error(`Migration file not found for ${version}`)
  }

  rollbackMigration(filename, version, name)
}

export function up(version: string) {
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error("No such version")
  }

  runMigration(filename, version, name)
}

export function down(version: string) {
  const { filename, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!filename || !name) {
    throw new Error("No such version")
  }

  rollbackMigration(filename, version, name)
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
    `export function up() {
}

export function down() {
}
`
  )
}

export function isMigrationNeeded() {
  const versions = listMigrationFiles().map((file) => file.version)
  const runMigrations = getCompletedMigrations()

  return versions.some((version) => !runMigrations.includes(version))
}

function createMigrationsTable() {
  db.run(`
    CREATE TABLE IF NOT EXISTS schemaMigrations (
      version TEXT PRIMARY KEY
    )
  `)
}

function runMigration(filename: string, version: string, name: string) {
  console.log(`Migration ${name} (${version}) ...`)

  require(`./${filename}`).up()

  db.query("INSERT INTO schemaMigrations (version) VALUES (?)").run(version)

  console.log("Complete")
}

function rollbackMigration(filename: string, version: string, name: string) {
  console.log(`Rolling back ${name} (${version}) ...`)

  require(`./${filename}`).down()

  db.query("DELETE FROM schemaMigrations WHERE version = ?").run(version)

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

function getCompletedMigrations() {
  return db
    .query<{ version: string }, any>("SELECT * FROM schemaMigrations")
    .all()
    .map((row) => row.version)
}
