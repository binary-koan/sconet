import ObjectID from "bson-objectid"
import { keyBy, pickBy } from "lodash"
import { JSONValue } from "postgres"
import { sql } from "./database"
import { assertFieldName } from "./utils/assertFieldName"

export type Repo<Record, RecordForInsert, Methods> = Methods & {
  tableName: string
  findAll: (options?: { limit?: number; offset?: number }) => Promise<Record[]>
  findByIds: (ids: readonly string[]) => Promise<Record[]>
  get: (id: string) => Promise<Record | undefined>
  insert: (recordForInsert: RecordForInsert) => Promise<Record>
  updateOne: (id: string, fields: Partial<Record>) => Promise<Record>
  softDelete: (id: string) => Promise<void>
}

export const createRepo = <
  Record extends { id: string; createdAt: Date; updatedAt: Date; deletedAt?: Date | null },
  RecordForInsert,
  Methods extends object
>({
  tableName: rawTableName,
  defaultOrder,
  load,
  serialize,
  formatForInsert,
  methods
}: {
  tableName: string
  defaultOrder: { [key in keyof Record]?: "ASC" | "DESC" }
  load: (row: any) => Record
  serialize: (record: Partial<Record>) => JSONValue & object
  formatForInsert: (
    record: RecordForInsert
  ) => Omit<Record, "id" | "createdAt" | "updatedAt" | "deletedAt">
  methods: Methods
}): Repo<Record, RecordForInsert, Methods> => {
  const tableName = sql(rawTableName)
  Object.keys(defaultOrder).forEach(assertFieldName)
  Object.values(defaultOrder).forEach(assertFieldName)

  return {
    tableName: rawTableName,

    ...methods,

    async findAll({ limit, offset }: { limit?: number; offset?: number } = {}) {
      const order = Object.entries(defaultOrder)
        .map(([name, value]) => [name, value].join(" "))
        .join(", ")

      const query = sql`SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY ${order}`

      const result = await sql`
        ${query}
        ${limit ? sql`LIMIT ${parseInt(limit.toString())}` : sql``}
        ${offset ? sql`OFFSET ${parseInt(offset.toString())}` : sql``}
      `

      return result.map(load)
    },

    async findByIds(ids) {
      const results = keyBy(
        (await sql`SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND id IN ${sql(ids)}`).map(
          load
        ),
        (record) => record.id
      )

      return ids.map((id) => results[id])
    },

    async get(id) {
      const result = sql`SELECT * FROM ${tableName} WHERE id = ${id}`

      return result ? load(result) : undefined
    },

    async insert(recordForInsert) {
      const id = ObjectID().toHexString()

      const record = serialize({
        ...formatForInsert(recordForInsert),
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Record)

      const result = await sql`INSERT INTO ${tableName} VALUES ${sql(record)} RETURNING *`

      return load(result[0]!)
    },

    async updateOne(id, fields) {
      const fieldsToSet = serialize({
        ...(pickBy(fields, (value) => value !== undefined) as Partial<Record>),
        updatedAt: new Date()
      })

      const result = await sql`UPDATE ${tableName} SET ${sql(
        fieldsToSet
      )} WHERE id = ${id} RETURNING *`

      if (!result.length) {
        throw new Error(`Record with id ${id} not found`)
      }

      return load(result[0]!)
    },

    async softDelete(id) {
      await sql`UPDATE ${tableName} SET deletedAt = ${new Date()} WHERE id = ${id}`
    }
  }
}
