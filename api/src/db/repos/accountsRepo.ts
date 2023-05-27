import { AccountRecord } from "../records/account"
import { createRepo } from "../repo"

export const accountsRepo = createRepo<AccountRecord, Record<string, never>>({
  tableName: "accounts",
  defaultOrder: { name: "ASC" },
  methods: {}
})
