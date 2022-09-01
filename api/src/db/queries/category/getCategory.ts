import { CategoryRecord } from "../../records/category"
import { db } from "../../database"
import { loadCategory } from "./loadCategory"

export function getCategory(id: string): CategoryRecord | undefined {
  const result = db.query("SELECT * FROM categories WHERE id = ?").get(id)

  return result && loadCategory(result)
}
