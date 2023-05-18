import { sql } from "../database"
import { loadDate } from "../utils"

export async function up() {
  for (const row of await sql`SELECT id, date FROM transactions`) {
    const currentDate = loadDate(row.date as number)
    const newDate = new Date(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      0
    )

    sql`UPDATE transactions SET date = ${newDate} WHERE id = ${row.id}`
  }
}

export async function down() {
  // Do nothing, we can't revert from this but it doesn't really matter since the idea is the same
}
