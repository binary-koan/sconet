import { keyBy, pickBy } from "lodash"
import { Helper } from "postgres"
import { sql } from "./database"
import { joinSql } from "./utils/joinSql"

export type Repo<Record, Methods> = Methods & {
  tableName: Helper<string>
  findAll: (options?: { limit?: number; offset?: number }) => Promise<Record[]>
  findByIds: (ids: readonly string[]) => Promise<Record[]>
  get: (id: string) => Promise<Record | undefined>
  insert: (record: Omit<Record, "id" | "createdAt" | "updatedAt" | "deletedAt">) => Promise<Record>
  updateOne: (id: string, fields: Partial<Record>) => Promise<Record>
  softDelete: (id: string) => Promise<void>
}

export const createRepo = <
  Record extends { id: string; createdAt: Date; updatedAt: Date; deletedAt?: Date | null },
  Methods extends object
>({
  tableName: rawTableName,
  defaultOrder,
  methods
}: {
  tableName: string
  defaultOrder: { [key in keyof Record]?: "ASC" | "DESC" }
  methods: Methods
}): Repo<Record, Methods> => {
  const tableName = sql(rawTableName)

  return {
    tableName,

    ...methods,

    async findAll({ limit, offset }: { limit?: number; offset?: number } = {}) {
      const order = joinSql(
        Object.entries(defaultOrder).map(
          ([name, value]) => sql`${sql(name)} ${value === "ASC" ? sql`ASC` : sql`DESC`}`
        ),
        ","
      )

      const query = sql`SELECT * FROM ${tableName} WHERE "deletedAt" IS NULL ORDER BY ${order}`

      const result = await sql<Record[]>`
        ${query}
        ${limit ? sql`LIMIT ${parseInt(limit.toString())}` : sql``}
        ${offset ? sql`OFFSET ${parseInt(offset.toString())}` : sql``}
      `

      return result
    },

    async findByIds(ids) {
      const results = keyBy(
        await sql<Record[]>`SELECT * FROM ${tableName} WHERE "deletedAt" IS NULL AND id IN ${sql(
          ids
        )}`,
        (record) => record.id
      )

      return ids.map((id) => results[id])
    },

    async get(id) {
      const result = await sql<Record[]>`SELECT * FROM ${tableName} WHERE id = ${id}`

      return result[0]
    },

    async insert(recordForInsert) {
      const record = {
        ...recordForInsert,
        createdAt: new Date(),
        updatedAt: new Date()
      } as any

      const result = await sql<Record[]>`INSERT INTO ${tableName} ${sql(record)} RETURNING *`

      return result[0]
    },

    async updateOne(id, fields) {
      const fieldsToSet = {
        ...(pickBy(fields, (value) => value !== undefined) as Partial<Record>),
        updatedAt: new Date()
      } as any

      const result = await sql<Record[]>`UPDATE ${tableName} SET ${sql(
        fieldsToSet
      )} WHERE "id" = ${id} RETURNING *`

      if (!result.length) {
        throw new Error(`Record with id ${id} not found`)
      }

      return result[0]
    },

    async softDelete(id) {
      await sql`UPDATE ${tableName} SET "deletedAt" = ${new Date()} WHERE "id" = ${id}`
    }
  }
}
