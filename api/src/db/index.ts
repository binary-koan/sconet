import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { Database } from './types'

export type { Database } from './types'
export * from './types'

export function createDb(connectionString: string): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString,
      }),
    }),
  })
}

// For Cloudflare Workers with Hyperdrive
export function createDbWithPool(pool: pg.Pool): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool,
    }),
  })
}
