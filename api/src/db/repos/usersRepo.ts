import { db } from "../database"
import { UserRecord } from "../records/user"
import { createRepo } from "../repo"

interface UserMethods {
  getByEmail(email: string): Promise<UserRecord | undefined>
}

export const usersRepo = createRepo<UserRecord, Record<string, never>, UserMethods>({
  tableName: "users",
  defaultOrder: { email: "ASC" },
  methods: {},
  asyncMethods: {
    async getByEmail(email) {
      return (await db.sql<UserRecord[]>`SELECT * FROM "users" WHERE "email" = ${email}`)[0]
    }
  }
})
