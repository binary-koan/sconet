import { db } from "../database"
import { UserRecord } from "../records/user"
import { createRepo } from "../repo"

interface UserMethods {
  getByEmail(email: string): Promise<UserRecord | undefined>
}

export const usersRepo = createRepo<UserRecord, UserMethods>({
  tableName: "users",
  defaultOrder: { email: "ASC" },
  methods: {
    async getByEmail(email) {
      return (await db.sql<UserRecord[]>`SELECT * FROM "users" WHERE "email" = ${email}`)[0]
    }
  }
})
