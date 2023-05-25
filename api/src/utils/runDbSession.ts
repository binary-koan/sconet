import { sql } from "../db/database"

export async function runDbSession(runner: () => void | Promise<void>) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[POSTGRESQL] Starting session")
    await sql`SELECT pg_stat_statements_reset()`
  }

  await runner()

  if (process.env.NODE_ENV !== "production") {
    const queries = await sql`SELECT * FROM pg_stat_statements`

    console.log("[POSTGRESQL] Queries during session")
    queries.forEach(({ query, calls, mean_exec_time, rows }) => {
      console.log(`- [${calls}x, avg ${mean_exec_time.toFixed(1)}ms, ${rows} rows] ${query}`)
    })

    await sql`SELECT pg_stat_statements_reset()`
  }
}
