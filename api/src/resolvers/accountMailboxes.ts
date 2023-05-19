import { AccountMailboxRecord } from "../db/records/accountMailbox"
import { accountMailboxesRepo } from "../db/repos/accountMailboxesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const accountMailboxes: QueryResolvers["accountMailboxes"] = () => {
  return accountMailboxesRepo.findAll()
}

export const accountMailbox: QueryResolvers["accountMailbox"] = async (_, { id }) => {
  return (await accountMailboxesRepo.get(id)) || null
}

export const createAccountMailbox: MutationResolvers["createAccountMailbox"] = async (
  _,
  { input }
) => {
  return await accountMailboxesRepo.insert(input)
}

export const updateAccountMailbox: MutationResolvers["updateAccountMailbox"] = async (
  _,
  { id, input }
) => {
  const accountMailbox = await accountMailboxesRepo.get(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  const updates: Partial<AccountMailboxRecord> = {
    ...input,
    name: input.name ?? undefined
  }

  return await accountMailboxesRepo.updateOne(id, updates)
}

export const deleteAccountMailbox: MutationResolvers["deleteAccountMailbox"] = async (
  _,
  { id }
) => {
  const accountMailbox = await accountMailboxesRepo.get(id)

  if (!accountMailbox) {
    throw new Error("Not found")
  }

  await accountMailboxesRepo.softDelete(id)

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
