import { CurrencyRecord } from "../records/currency"
import { createRepo } from "../repo"

export const currenciesRepo = createRepo<CurrencyRecord, {}>({
  tableName: "currencies",
  defaultOrder: { code: "ASC" },
  methods: {}
})
