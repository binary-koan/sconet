import { sql } from "../database"
import { CategoryRecord } from "../records/category"
import { createRepo } from "../repo"

interface CategoryMethods {
  setOrder: (orderedIds: string[]) => Promise<void>
  nextSortOrder: () => Promise<number>
}

export const categoriesRepo = createRepo<CategoryRecord, CategoryMethods>({
  tableName: "categories",
  defaultOrder: { sortOrder: "ASC", name: "ASC" },

  methods: {
    async setOrder(orderedIds) {
      await sql.begin(async (sql) => {
        for (const [index, id] of orderedIds.entries()) {
          await sql`UPDATE categories SET sortOrder = ${index} WHERE id = ${id}`
        }
      })
    },

    async nextSortOrder() {
      const result = await sql<Array<{ max: number }>>`SELECT MAX(sortOrder) as max FROM categories`

      return (result[0]?.max ?? 0) + 1
    }
  }
})
