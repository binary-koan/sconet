import { db } from "../database"
import { loadCategory } from "./loadCategory"

export function findCategories() {
  return db
    .query(`SELECT * FROM categories WHERE deletedAt IS NULL ORDER BY sortOrder ASC, name ASC`)
    .all()
    .map(loadCategory)
}
