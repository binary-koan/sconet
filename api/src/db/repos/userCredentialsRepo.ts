import { MakeOptional } from "../../types"
import { db } from "../database"
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
    findForUser(userId: string) {
      return db
        .query(`SELECT * FROM userCredentials WHERE userId = ? AND deletedAt IS NULL ORDER BY createdAt ASC, id ASC`)
        .all(userId)
        .map(loadUserCredential)
    }
  }
})
