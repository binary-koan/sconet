import { keyBy, pickBy } from "lodash"
import { Sql } from "postgres"
import { db } from "./database"
import { joinSql } from "./utils/joinSql"

export type RecordForInsert<Record> = Omit<Record, "id" | "createdAt" | "updatedAt" | "deletedAt">

export type Repo<Record, Methods> = Methods & {
  tableName: string
  findAll: (options?: { limit?: number; offset?: number }, sql?: Sql) => Promise<Record[]>
  findByIds: (ids: readonly string[], sql?: Sql) => Promise<Record[]>
  get: (id: string, sql?: Sql) => Promise<Record | undefined>
  insert: (record: RecordForInsert<Record>, sql?: Sql) => Promise<Record>
  insertAll: (record: Array<RecordForInsert<Record>>, sql?: Sql) => Promise<Record[]>
  updateOne: (id: string, fields: Partial<Record>, sql?: Sql) => Promise<Record>
  softDelete: (id: string, sql?: Sql) => Promise<void>
}

const withTimeout = async <Result>(query: () => Result) => {
  const timeout = setTimeout(() => {
    console.error("Query time limit of 5s exceeded, the postgres connection may be broken")
    process.exit(1)
  }, 5000)

  const result = await query()

  clearTimeout(timeout)

  return result
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
  const tableName = db.sql(rawTableName)

  const insertAll = (recordsForInsert: Array<RecordForInsert<Record>>, s = db.sql) =>
    withTimeout(async () => {
      const records = recordsForInsert.map(
        (recordForInsert) =>
          ({
            ...recordForInsert,
            createdAt: new Date(),
            updatedAt: new Date()
          } as any)
      )

      const result = await s<Record[]>`INSERT INTO ${tableName} ${s(records)} RETURNING *`

      return result
    })

  return {
    tableName: rawTableName,

    ...Object.entries(methods).reduce<Methods>(
      (methods, [name, method]) => ({
        ...methods,
        [name]: (...args: any[]) => withTimeout(() => method(...args))
      }),
      {} as Methods
    ),

    async findAll({ limit, offset }: { limit?: number; offset?: number } = {}, s = db.sql) {
      return withTimeout(async () => {
        const order = joinSql(
          Object.entries(defaultOrder).map(
            ([name, value]) => s`${s(name)} ${value === "ASC" ? s`ASC` : s`DESC`}`
          ),
          ","
        )

        const query = s`SELECT * FROM ${tableName} WHERE "deletedAt" IS NULL ORDER BY ${order}`

        const result = await s<Record[]>`
        ${query}
        ${limit ? s`LIMIT ${parseInt(limit.toString())}` : s``}
        ${offset ? s`OFFSET ${parseInt(offset.toString())}` : s``}
      `

        return result
      })
    },

    async findByIds(ids, s = db.sql) {
      return withTimeout(async () => {
        const results = keyBy(
          await s<Record[]>`SELECT * FROM ${tableName} WHERE "deletedAt" IS NULL AND id IN ${s(
            ids
          )}`,
          (record) => record.id
        )

        return ids.map((id) => results[id])
      })
    },

    async get(id, s = db.sql) {
      return withTimeout(async () => {
        const result = await s<Record[]>`SELECT * FROM ${tableName} WHERE id = ${id}`

        return result[0]
      })
    },

    async insert(recordForInsert, s = db.sql) {
      return withTimeout(async () => {
        return (await insertAll([recordForInsert], s))[0]
      })
    },

    async insertAll(recordsForInsert, s = db.sql) {
      return withTimeout(async () => {
        return await insertAll(recordsForInsert, s)
      })
    },

    async updateOne(id, fields, s = db.sql) {
      return withTimeout(async () => {
        const fieldsToSet = {
          ...(pickBy(fields, (value) => value !== undefined) as Partial<Record>),
          updatedAt: new Date()
        } as any

        const result = await s<Record[]>`UPDATE ${tableName} SET ${s(
          fieldsToSet
        )} WHERE "id" = ${id} RETURNING *`

        if (!result.length) {
          throw new Error(`Record with id ${id} not found`)
        }

        return result[0]
      })
    },

    async softDelete(id, s = db.sql) {
      return withTimeout(async () => {
        await s`UPDATE ${tableName} SET "deletedAt" = ${new Date()} WHERE "id" = ${id}`
      })
    }
  }
}
