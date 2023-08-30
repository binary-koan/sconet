import fs from "fs"
import { groupBy, map, orderBy } from "lodash"
import { runDbSession } from "../utils/runDbSession"
import { db } from "./database"

const UP_FILENAME_PATTERN = /^(\d+)-(\w+)-up\.sql$/
const BASE_PATH = process.env.MIGRATIONS_PATH || `${import.meta.dir}/migrations`

export async function migrate() {
  await createMigrationsTable()

  const runMigrations = await getCompletedMigrations()
  const migrationsToRun = listMigrationFiles().filter(
    ({ version }) => !runMigrations.includes(version)
  )

  if (migrationsToRun.length) {
    for (const { upPath, version, name } of migrationsToRun) {
      await runMigration(upPath, version, name)
    }

    await writeSchema()
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
  const { downPath, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!name) {
    throw new Error(`Migration file not found for ${version}`)
  }

  await rollbackMigration(downPath, version, name)
  await writeSchema()
}

export async function up(version: string) {
  const { upPath, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!upPath || !name) {
    throw new Error("No such version")
  }

  await runMigration(upPath, version, name)
  await writeSchema()
}

export async function down(version: string) {
  const { downPath, name } = listMigrationFiles().find((file) => file.version === version) || {}

  if (!name) {
    throw new Error("No such version")
  }

  await rollbackMigration(downPath, version, name)
  await writeSchema()
}

export async function writeSchema() {
  const columns = await db.sql<
    Array<{
      table_name: string
      column_name: string
      data_type: string
      is_nullable: boolean
      column_default: any
    }>
  >`
    SELECT table_name, column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
  `

  const constraints = await db.sql<
    Array<{
      table_name: string
      column_name: string
      constraint_name: string
    }>
  >`
    SELECT table_name, column_name, constraint_name
    FROM information_schema.constraint_column_usage
    WHERE table_schema = 'public'
  `

  const indexes = await db.sql<
    Array<{
      tablename: string
      indexname: string
    }>
  >`
    SELECT tablename, indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
  `

  const tables = orderBy(columns, ["table_name", "column_name"])
    .filter(
      (column) =>
        column.table_name !== "pg_stat_statements" &&
        column.table_name !== "pg_stat_statements_info" &&
        column.table_name !== "schemaMigrations"
    )
    .map((column) => ({
      ...column,
      constraints: constraints.filter(
        (constraint) =>
          constraint.column_name === column.column_name &&
          constraint.table_name === column.table_name
      )
    }))

  const formatted = map(groupBy(tables, "table_name"), (columns, tableName) =>
    [
      `## \`${tableName}\``,
      "",
      "Columns",
      ...columns.map(({ column_name, data_type, is_nullable, column_default, constraints }) =>
        [
          ["-", `\`${column_name}\``, data_type, !is_nullable && "not null"]
            .filter(Boolean)
            .join(" "),

          column_default && `  - default: \`${column_default}\``,

          ...constraints.map(
            (constraint) => `  - used in constraint: \`${constraint.constraint_name}\``
          )
        ]
          .filter(Boolean)
          .join("\n")
      ),
      "",
      "Indexes",
      ...indexes
        .filter((index) => index.tablename === tableName)
        .map((index) => `- \`${index.indexname}\``)
    ].join("\n")
  ).join("\n\n")

  await Bun.write(`${BASE_PATH}/schema.md`, formatted)
}

export async function createMigration(name: string) {
  const now = new Date()
  const timestamp = [
    now.getFullYear(),
    now.getMonth().toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0")
  ].join("")

  await Bun.write(`${BASE_PATH}/${timestamp}-${name}-up.sql`, "")
  await Bun.write(`${BASE_PATH}/${timestamp}-${name}-down.sql`, "")
}

export async function isMigrationNeeded() {
  const versions = listMigrationFiles().map((file) => file.version)
  const runMigrations = await getCompletedMigrations()

  return versions.some((version) => !runMigrations.includes(version))
}

async function createMigrationsTable() {
  await db.sql`
    CREATE TABLE IF NOT EXISTS "schemaMigrations" (
      version TEXT PRIMARY KEY
    )
  `
}

async function runMigration(upPath: string, version: string, name: string) {
  console.log(`Migration ${name} (${version}) ...`)

  await runDbSession(async () => {
    const query = await Bun.file(upPath).text()

    await db.sql.unsafe(query)

    await db.sql`INSERT INTO "schemaMigrations" (version) VALUES (${db.sql({ version })})`
  })

  console.log("Complete")
}

async function rollbackMigration(downPath: string | undefined, version: string, name: string) {
  console.log(`Rolling back ${name} (${version}) ...`)

  if (!downPath) {
    throw new Error('No "down" migration found, this migration is irreversible')
  }

  await runDbSession(async () => {
    const query = await Bun.file(downPath).text()

    await db.sql.unsafe(query)

    await db.sql`DELETE FROM "schemaMigrations" WHERE version = ${version}`
  })

  console.log("Complete")
}

interface MigrationDefinition {
  upPath: string
  downPath?: string
  version: string
  name: string
}

function listMigrationFiles() {
  const allFiles = fs.readdirSync(BASE_PATH)

  return orderBy(allFiles)
    .map((filename) => {
      const [, version, name] = UP_FILENAME_PATTERN.exec(filename) || []

      if (!version || !name) return

      const downFilename = `${BASE_PATH}/${version}-${name}-down.sql`

      return {
        upPath: `${BASE_PATH}/${filename}`,
        downPath: allFiles.includes(downFilename) ? `${BASE_PATH}/${downFilename}` : undefined,
        version,
        name
      }
    })
    .filter((value) => value !== undefined) as MigrationDefinition[]
}

async function getCompletedMigrations() {
  return (await db.sql`SELECT * FROM "schemaMigrations"`).map((row) => row.version as string)
}
