import { AccountRecord } from "../records/account"
import { createRepo } from "../repo"

export const accountsRepo = createRepo<AccountRecord>({
  tableName: "accounts",
  defaultOrder: { name: "ASC" },
  methods: {},
  asyncMethods: {}
})
