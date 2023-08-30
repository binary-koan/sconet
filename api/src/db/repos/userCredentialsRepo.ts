import { db } from "../database"
import { UserCredentialRecord } from "../records/userCredential"
import { createRepo } from "../repo"

export interface UserCredentialMethods {
  findForUser: (userId: string) => Promise<UserCredentialRecord[]>
}

export const userCredentialsRepo = createRepo<UserCredentialRecord, UserCredentialMethods>({
  tableName: "userCredentials",
  defaultOrder: { createdAt: "ASC", id: "ASC" },

  methods: {
    async findForUser(userId: string) {
      return await db.sql`SELECT * FROM "userCredentials" WHERE "userId" = ${userId} AND "deletedAt" IS NULL ORDER BY "createdAt" ASC, "id" ASC`
    }
  }
})
