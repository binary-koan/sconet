import { db } from "../database"
import { loadDate, serializeDate } from "../utils"

export function up() {
  db.query<any, any>("SELECT id, date FROM transactions")
    .all()
    .forEach((row) => {
      const currentDate = loadDate(row.date as number)
      const newDate = new Date(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        0
      )

      db.run("UPDATE transactions SET date = ? WHERE id = ?", serializeDate(newDate), row.id)
    })
}

export function down() {
  // Do nothing, we can't revert from this but it doesn't really matter since the idea is the same
}
