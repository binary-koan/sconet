import { MakeOptional } from "../../types"
import { AccountMailboxRecord } from "../records/accountMailbox"
import { createRepo } from "../repo"
import { loadAccountMailbox } from "./accountMailboxes/loadAccountMailbox"
import { serializeAccountMailbox } from "./accountMailboxes/serializeAccountMailbox"

export type AccountMailboxForInsert = MakeOptional<
  Omit<AccountMailboxRecord, "id">,
  | "mailServerOptions"
  | "fromAddressPattern"
  | "datePattern"
  | "memoPattern"
  | "amountPattern"
  | "deletedAt"
  | "createdAt"
  | "updatedAt"
>

export const accountMailboxesRepo = createRepo({
  tableName: "accountMailboxes",
  defaultOrder: { name: "ASC" },
  load: loadAccountMailbox,
  serialize: serializeAccountMailbox,

  formatForInsert: (accountMailbox: AccountMailboxForInsert) => ({
    mailServerOptions: {},
    fromAddressPattern: null,
    datePattern: null,
    memoPattern: null,
    amountPattern: null,
    ...accountMailbox
  }),

  methods: {}
})
