import ObjectID from "bson-objectid"
import { keyBy, pickBy } from "lodash"
import { db } from "./database"
import { serializeDate } from "./utils"
import { assertFieldName } from "./utils/assertFieldName"
import {
  arrayBindings,
  arrayQuery,
  fieldBindings,
  fieldsInsertQuery,
  fieldsUpdateQuery
} from "./utils/fields"

export type Repo<Record, RecordForInsert, Methods> = Methods & {
  findAll: () => Record[]
  findByIds: (ids: readonly string[]) => Record[]
  get: (id: string) => Record | undefined
  insert: (recordForInsert: RecordForInsert) => string
  updateOne: (id: string, fields: Partial<Record>) => string
  softDelete: (id: string) => void
}

export const createRepo = <
  Record extends { id: string; createdAt: Date; updatedAt: Date; deletedAt: Date | null },
  RecordForInsert,
  Methods extends object
>({
  tableName,
  defaultOrder,
  load,
  serialize,
  formatForInsert,
  methods
}: {
  tableName: string
  defaultOrder: { [key in keyof Record]?: "ASC" | "DESC" }
  load: (row: any) => Record
  serialize: (record: Partial<Record>) => any
  formatForInsert: (
    record: RecordForInsert
  ) => Omit<Record, "id" | "createdAt" | "updatedAt" | "deletedAt">
  methods: Methods
}): Repo<Record, RecordForInsert, Methods> => {
  assertFieldName(tableName)
  Object.keys(defaultOrder).forEach(assertFieldName)
  Object.values(defaultOrder).forEach(assertFieldName)

  return {
    ...methods,

    findAll() {
      const order = Object.entries(defaultOrder)
        .map(([name, value]) => [name, value].join(" "))
        .join(", ")

      return db
        .query(`SELECT * FROM ${tableName} WHERE deletedAt IS NULL ORDER BY ${order}`)
        .all()
        .map(load)
    },

    findByIds(ids) {
      const results = keyBy(
        db
          .query(`SELECT * FROM ${tableName} WHERE deletedAt IS NULL AND id IN ${arrayQuery(ids)}`)
          .all(arrayBindings(ids))
          .map(load),
        (record) => record.id
      )

      return ids.map((id) => results[id])
    },

    get(id) {
      const result = db.query("SELECT * FROM ${tableName} WHERE id = ?").get(id)

      return result && load(result)
    },

    insert(recordForInsert) {
      const id = ObjectID().toHexString()

      const record = {
        ...formatForInsert(recordForInsert),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      db.run(
        `INSERT INTO ${tableName} ${fieldsInsertQuery(id, record)}`,
        fieldBindings({ id, ...serialize(record as Partial<Record>) })
      )

      return id
    },

    updateOne(id, fields) {
      const fieldsToSet = {
        ...serialize(pickBy(fields, (value) => value !== undefined) as Partial<Record>),
        updatedAt: new Date()
      }

      db.run(
        `UPDATE ${tableName} SET ${fieldsUpdateQuery(fieldsToSet)} WHERE id = $id`,
        fieldBindings({ id, ...fieldsToSet })
      )

      return id
    },

    softDelete(id) {
      db.run(`UPDATE ${tableName} SET deletedAt = $now WHERE id = $id`, {
        $id: id,
        $now: serializeDate(new Date())
      })
    }
  }
}
