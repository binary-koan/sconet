import { Plugin } from "graphql-yoga"
import { sql } from "../db/database"

export async function runDbSession(runner: () => void | Promise<void>) {
  await startDbSession()
  await runner()
  await endDbSession()
}

export const dbSessionPlugin: Plugin = {
  async onExecute() {
    await startDbSession()

    return {
      async onExecuteDone() {
        await endDbSession()
      }
    }
  }
}

async function startDbSession() {
  if (Bun.env.PG_STAT_STATEMENTS) {
    console.log("[POSTGRESQL] Starting session")
    await sql`SELECT pg_stat_statements_reset()`
  }
}

async function endDbSession() {
  if (Bun.env.PG_STAT_STATEMENTS) {
    const queries = await sql`SELECT * FROM pg_stat_statements`

    console.log("[POSTGRESQL] Queries during session")
    queries.forEach(({ query, calls, mean_exec_time, rows }) => {
      console.log(`- [${calls}x, avg ${mean_exec_time.toFixed(1)}ms, ${rows} rows] ${query}`)
    })

    await sql`SELECT pg_stat_statements_reset()`
  }
}
