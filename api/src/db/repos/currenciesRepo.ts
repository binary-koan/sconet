import { MakeOptional } from "../../types"
import { CurrencyRecord } from "../records/currency"
import { createRepo } from "../repo"
import { loadCurrency } from "./currencies/loadCurrency"
import { serializeCurrency } from "./currencies/serializeCurrency"

export type CurrencyForInsert = MakeOptional<
  Omit<CurrencyRecord, "id">,
  "deletedAt" | "createdAt" | "updatedAt"
>

export const currenciesRepo = createRepo({
  tableName: "currencies",
  defaultOrder: { code: "ASC" },
  load: loadCurrency,
  serialize: serializeCurrency,

  formatForInsert: (currency: CurrencyForInsert) => currency,

  methods: {}
})
