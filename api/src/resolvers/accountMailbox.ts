import { AccountMailboxRecord } from "../db/accountMailbox"
import { findAccountMailboxes } from "../db/accountMailbox/findAccountMailboxes"
import { getAccountMailbox } from "../db/accountMailbox/getAccountMailbox"
import { insertAccountMailbox } from "../db/accountMailbox/insertAccountMailbox"
import { softDeleteAccountMailbox } from "../db/accountMailbox/softDeleteAccountMailbox"
import { updateOneAccountMailbox } from "../db/accountMailbox/updateOneAccountMailbox"
import { findTransactions } from "../db/transaction/findTransactions"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const accountMailboxes: QueryResolvers["accountMailboxes"] = () => {
  return findAccountMailboxes()
}

export const accountMailbox: QueryResolvers["accountMailbox"] = (_, { id }) => {
  return getAccountMailbox(id) || null
}

export const createAccountMailbox: MutationResolvers["createAccountMailbox"] = (_, { input }) => {
  const id = insertAccountMailbox(input)

  return getAccountMailbox(id)!
}

export const updateAccountMailbox: MutationResolvers["updateAccountMailbox"] = (
  _,
  { id, input }
) => {
  const accountMailbox = getAccountMailbox(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  const updates: Partial<AccountMailboxRecord> = {
    ...input,
    name: input.name || undefined
  }

  updateOneAccountMailbox(id, updates)

  return getAccountMailbox(id)!
}

export const deleteAccountMailbox: MutationResolvers["deleteAccountMailbox"] = (_, { id }) => {
  const accountMailbox = getAccountMailbox(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  softDeleteAccountMailbox(id)

  return accountMailbox
}

export const AccountMailbox: Resolvers["AccountMailbox"] = {
  id: (accountMailbox) => accountMailbox.id,
  name: (accountMailbox) => accountMailbox.name,
  mailServerOptions: (accountMailbox) => accountMailbox.mailServerOptions,
  fromAddressPattern: (accountMailbox) => accountMailbox.fromAddressPattern,
  datePattern: (accountMailbox) => accountMailbox.datePattern,
  memoPattern: (accountMailbox) => accountMailbox.memoPattern,
  amountPattern: (accountMailbox) => accountMailbox.amountPattern,

  transactions: (accountMailbox) =>
    findTransactions({ filter: { accountMailboxId: accountMailbox.id } }).data
}
