import { AccountRecord } from "../db/records/account"
import { accountsRepo } from "../db/repos/accountsRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const accounts: QueryResolvers["accounts"] = () => {
  return accountsRepo.findAll()
}

export const account: QueryResolvers["account"] = async (_, { id }) => {
  return (await accountsRepo.get(id)) || null
}

export const createAccount: MutationResolvers["createAccount"] = async (_, { input }) => {
  return await accountsRepo.insert(input)
}

export const updateAccount: MutationResolvers["updateAccount"] = async (_, { id, input }) => {
  const account = await accountsRepo.get(id)

  if (!account) {
    throw new Error("Not found")
  }

  const updates: Partial<AccountRecord> = {
    ...input,
    name: input.name ?? undefined
  }

  return await accountsRepo.updateOne(id, updates)
}

export const deleteAccount: MutationResolvers["deleteAccount"] = async (_, { id }) => {
  const account = await accountsRepo.get(id)

  if (!account) {
    throw new Error("Not found")
  }

  await accountsRepo.softDelete(id)

  return account
}

export const Account: Resolvers["Account"] = {
  id: (account) => account.id,
  name: (account) => account.name,
  transactions: (account) => transactionsRepo.filter({ filter: { accountId: account.id } }).data
}
