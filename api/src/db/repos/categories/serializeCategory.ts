import { CategoryRecord } from "../../records/category"
import { serializeDate } from "../../utils"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeCategory(category: Partial<CategoryRecord>) {
  return serializePartialRecord(category, {
    isRegular: (isRegular) => (isRegular === false ? isRegular : true),
    sortOrder: (sortOrder) => sortOrder || null,
    deletedAt: serializeDate,
    createdAt: serializeDate,
    updatedAt: serializeDate
  })
}
