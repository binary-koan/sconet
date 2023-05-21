import postgres from "postgres"

const rawSql = postgres(process.env.POSTGRES_URI!)

export const sql: postgres.Sql<{}> = (template: any, ...parameters: any[]) => {
  if (Array.isArray(template) && "raw" in template && Array.isArray(template.raw)) {
    const raw = rawSql(template as TemplateStringsArray, ...parameters)

    if (process.env.LOG_ALL_SQL) {
      console.log(`[POSTGRES:QUERY] ${(template.raw as any).join(" ? ").replace(/\s+/g, " ")}`)
      console.log(`[POSTGRES:QUERY BINDINGS]`, parameters)
    }

    return raw
  }

  return rawSql(template, ...parameters) as any
}

sql.CLOSE = rawSql.CLOSE
sql.END = rawSql.END
sql.PostgresError = rawSql.PostgresError
sql.options = rawSql.options
sql.parameters = rawSql.parameters
sql.types = rawSql.types
sql.typed = rawSql.typed
sql.unsafe = rawSql.unsafe
sql.end = rawSql.end
sql.listen = rawSql.listen
sql.notify = rawSql.notify
sql.subscribe = rawSql.subscribe
sql.largeObject = rawSql.largeObject
sql.begin = rawSql.begin
sql.array = rawSql.array
sql.file = rawSql.file
sql.json = rawSql.json
