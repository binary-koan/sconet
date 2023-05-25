import { difference, union } from "lodash"
import { Currencies } from "ts-money"
import { UserRecord, UserSettings } from "../db/records/user"
import { userCredentialsRepo } from "../db/repos/userCredentialsRepo"
import { usersRepo } from "../db/repos/usersRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const currentUser: QueryResolvers["currentUser"] = async (_, _args, context) => {
  return context.currentUser || null
}

export const favoriteCurrency: MutationResolvers["favoriteCurrency"] = async (
  _,
  { code },
  context
) => {
  return await updateSettings(context.currentUser, {
    favoriteCurrencyCodes: union(context.currentUser.settings.favoriteCurrencyCodes, [code])
  })
}

export const unfavoriteCurrency: MutationResolvers["unfavoriteCurrency"] = async (
  _,
  { code },
  context
) => {
  return await updateSettings(context.currentUser, {
    favoriteCurrencyCodes: difference(context.currentUser.settings.favoriteCurrencyCodes, [code])
  })
}

export const setDefaultCurrency: MutationResolvers["setDefaultCurrency"] = async (
  _,
  { code },
  context
) => {
  return await updateSettings(context.currentUser, {
    defaultCurrencyCode: code
  })
}

export const CurrentUser: Resolvers["CurrentUser"] = {
  id: (user) => user.id,
  email: (user) => user.email,
  defaultCurrency: (user) => Currencies[user.settings.defaultCurrencyCode],
  favoriteCurrencies: (user) => user.settings.favoriteCurrencyCodes.map((code) => Currencies[code]),
  registeredCredentials: (user) => userCredentialsRepo.findForUser(user.id)
}

export const UserCredential: Resolvers["UserCredential"] = {
  id: (credential) => credential.id,
  device: (credential) => credential.device,
  createdAt: (credential) => credential.createdAt
}

async function updateSettings(user: UserRecord, settings: Partial<UserSettings>) {
  return await usersRepo.updateOne(user.id, {
    settings: {
      ...user.settings,
      ...settings
    }
  })
}
