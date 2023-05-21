import { CategoryRecord } from "../db/records/category"
import { categoriesRepo } from "../db/repos/categoriesRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"
import { convertCurrency } from "./money"

export const categories: QueryResolvers["categories"] = () => {
  return categoriesRepo.findAll()
}

export const category: QueryResolvers["category"] = async (_, { id }) => {
  return (await categoriesRepo.get(id)) || null
}

export const createCategory: MutationResolvers["createCategory"] = async (_, { input }) => {
  return await categoriesRepo.insert({ ...input, sortOrder: await categoriesRepo.nextSortOrder() })
}

export const updateCategory: MutationResolvers["updateCategory"] = async (_, { id, input }) => {
  const category = await categoriesRepo.get(id)

  if (!category) {
    throw new Error("Not found")
  }

  const updates: Partial<CategoryRecord> = {
    ...input,
    name: input.name ?? undefined,
    color: input.color ?? undefined,
    icon: input.icon ?? undefined,
    isRegular: input.isRegular ?? undefined
  }

  return await categoriesRepo.updateOne(id, updates)
}

export const deleteCategory: MutationResolvers["deleteCategory"] = async (_, { id }) => {
  const category = await categoriesRepo.get(id)

  if (!category) {
    throw new Error("Not found")
  }

  await categoriesRepo.softDelete(id)

  return category
}

export const reorderCategories: MutationResolvers["reorderCategories"] = async (
  _,
  { orderedIds }
) => {
  await categoriesRepo.setOrder(orderedIds)

  return categoriesRepo.findAll()
}

export const Category: Resolvers["Category"] = {
  id: (category) => category.id,
  name: (category) => category.name,
  color: (category) => category.color,
  icon: (category) => category.icon,

  budget: async (category, { currencyId }, context) =>
    category.budget != null && category.budgetCurrencyId
      ? convertCurrency({
          amount: category.budget,
          currency: await context.data.currency.load(category.budgetCurrencyId),
          target: currencyId ? { currencyId } : undefined,
          context
        })
      : null,

  budgetCurrency: (category, _, context) =>
    category.budgetCurrencyId ? context.data.currency.load(category.budgetCurrencyId) : null,

  isRegular: (category) => category.isRegular,
  sortOrder: (category) => category.sortOrder,
  createdAt: (category) => category.createdAt,
  updatedAt: (category) => category.updatedAt
}
