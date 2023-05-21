import { CategoryRecord } from "../../records/category"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeCategory(category: Partial<CategoryRecord>) {
  return serializePartialRecord(category, {
    isRegular: (isRegular) => (isRegular === false ? isRegular : true),
    sortOrder: (sortOrder) => sortOrder ?? null
  })
}
