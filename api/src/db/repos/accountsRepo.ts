import { MakeOptional } from "../../types"
import { AccountRecord } from "../records/account"
import { createRepo } from "../repo"
import { loadAccount } from "./accounts/loadAccount"
import { serializeAccount } from "./accounts/serializeAccount"

export type AccountForInsert = MakeOptional<
  Omit<AccountRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export const accountsRepo = createRepo({
  tableName: "accounts",
  defaultOrder: { name: "ASC" },
  load: loadAccount,
  serialize: serializeAccount,

  formatForInsert: (account: AccountForInsert) => account,

  methods: {}
})
