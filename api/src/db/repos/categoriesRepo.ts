import { db } from "../database"
import { CategoryRecord } from "../records/category"
import { createRepo } from "../repo"

interface CategoryMethods {
  setOrder: (orderedIds: string[]) => Promise<void>
  nextSortOrder: () => Promise<number>
}

export const categoriesRepo = createRepo<CategoryRecord, Record<string, never>, CategoryMethods>({
  tableName: "categories",
  defaultOrder: { sortOrder: "ASC", name: "ASC" },

  methods: {},

  asyncMethods: {
    async setOrder(orderedIds) {
      await db.sql.begin(async (sql) => {
        for (const [index, id] of orderedIds.entries()) {
          await sql`UPDATE "categories" SET "sortOrder" = ${index} WHERE "id" = ${id}`
        }
      })
    },

    async nextSortOrder() {
      const result = await db.sql<
        Array<{ max: number }>
      >`SELECT MAX("sortOrder") as "max" FROM "categories"`

      return (result[0]?.max ?? 0) + 1
    }
  }
})
