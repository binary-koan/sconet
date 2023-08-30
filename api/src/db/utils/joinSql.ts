import { PendingQuery } from "postgres"
import { db } from "../database"

const JOIN_WITH_SEPARATOR = {
  ",": (first: PendingQuery<any>, second: PendingQuery<any>) => db.sql`${first}, ${second}`,
  AND: (first: PendingQuery<any>, second: PendingQuery<any>) => db.sql`${first} AND ${second}`,
  OR: (first: PendingQuery<any>, second: PendingQuery<any>) => db.sql`${first} OR ${second}`
}

export function joinSql(queries: Array<PendingQuery<any>>, separator: "," | "AND" | "OR") {
  const [query, ...rest] = queries

  if (!query) {
    return query
  }

  return rest.reduce((query, clause) => JOIN_WITH_SEPARATOR[separator](query, clause), query)
}
