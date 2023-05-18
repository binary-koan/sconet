import { MakeOptional } from "../../types"
import { sql } from "../database"
import { CategoryRecord } from "../records/category"
import { createRepo } from "../repo"
import { loadCategory } from "./categories/loadCategory"
import { serializeCategory } from "./categories/serializeCategory"

export type CategoryForInsert = MakeOptional<
  Omit<CategoryRecord, "id">,
  | "isRegular"
  | "budget"
  | "budgetCurrencyId"
  | "sortOrder"
  | "deletedAt"
  | "createdAt"
  | "updatedAt"
>

export const categoriesRepo = createRepo({
  tableName: "categories",
  defaultOrder: { sortOrder: "ASC", name: "ASC" },
  load: loadCategory,
  serialize: serializeCategory,

  formatForInsert: (category: CategoryForInsert) => ({
    isRegular: true,
    budget: null,
    budgetCurrencyId: null,
    sortOrder: 0,
    ...category
  }),

  methods: {
    async setOrder(orderedIds: string[]) {
      await sql.begin(async (sql) => {
        for (const [index, id] of orderedIds.entries()) {
          await sql`UPDATE categories SET sortOrder = ${index} WHERE id = ${id}`
        }
      })
    }
  }
})
