import { AccountMailboxRecord } from "../db/records/accountMailbox"
import { accountMailboxesRepo } from "../db/repos/accountMailboxesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const accountMailboxes: QueryResolvers["accountMailboxes"] = () => {
  return accountMailboxesRepo.findAll()
}

export const accountMailbox: QueryResolvers["accountMailbox"] = (_, { id }) => {
  return accountMailboxesRepo.get(id) || null
}

export const createAccountMailbox: MutationResolvers["createAccountMailbox"] = (_, { input }) => {
  const id = accountMailboxesRepo.insert(input)

  return accountMailboxesRepo.get(id)!
}

export const updateAccountMailbox: MutationResolvers["updateAccountMailbox"] = (
  _,
  { id, input }
) => {
  const accountMailbox = accountMailboxesRepo.get(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  const updates: Partial<AccountMailboxRecord> = {
    ...input,
    name: input.name || undefined
  }

  accountMailboxesRepo.updateOne(id, updates)

  return accountMailboxesRepo.get(id)!
}

export const deleteAccountMailbox: MutationResolvers["deleteAccountMailbox"] = (_, { id }) => {
  const accountMailbox = accountMailboxesRepo.get(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  accountMailboxesRepo.softDelete(id)

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
    transactionsRepo.filter({ filter: { accountMailboxId: accountMailbox.id } }).data
}
