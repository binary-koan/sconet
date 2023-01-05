import { MakeOptional } from "../../types"
import { db } from "../database"
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
    setOrder(orderedIds: string[]) {
      const update = db.prepare("UPDATE categories SET sortOrder = $sortOrder WHERE id = $id")

      db.transaction(() => {
        orderedIds.forEach((id, index) => update.run({ $sortOrder: index, $id: id }))
      })()
    }
  }
})
