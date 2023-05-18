import { MakeOptional } from "../../types"
import { sql } from "../database"
import { UserCredentialRecord } from "../records/userCredential"
import { createRepo } from "../repo"
import { loadUserCredential } from "./userCredentials/loadUserCredential"
import { serializeUserCredential } from "./userCredentials/serializeUserCredential"

export type UserCredentialForInsert = MakeOptional<
  Omit<UserCredentialRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export const userCredentialsRepo = createRepo({
  tableName: "userCredentials",
  defaultOrder: { createdAt: "ASC", id: "ASC" },
  load: loadUserCredential,
  serialize: serializeUserCredential,

  formatForInsert: (credential: UserCredentialForInsert) => ({
    ...credential
  }),

  methods: {
    async findForUser(userId: string) {
      return (
        await sql`SELECT * FROM userCredentials WHERE userId = ${userId} AND deletedAt IS NULL ORDER BY createdAt ASC, id ASC`
      ).map(loadUserCredential)
    }
  }
})
