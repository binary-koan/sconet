import { findCategories } from "../db/queries/category/findCategories"
import { getCategory } from "../db/queries/category/getCategory"
import { insertCategory } from "../db/queries/category/insertCategory"
import { setCategoryOrder } from "../db/queries/category/setCategoryOrder"
import { softDeleteCategory } from "../db/queries/category/softDeleteCategory"
import { updateOneCategory } from "../db/queries/category/updateOneCategory"
import { CategoryRecord } from "../db/records/category"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const categories: QueryResolvers["categories"] = () => {
  return findCategories()
}

export const category: QueryResolvers["category"] = (_, { id }) => {
  return getCategory(id) || null
}

export const createCategory: MutationResolvers["createCategory"] = (_, { input }) => {
  const id = insertCategory(input)

  return getCategory(id)!
}

export const updateCategory: MutationResolvers["updateCategory"] = (_, { id, input }) => {
  const category = getCategory(id)

  if (!category) {
    throw new Error("Not found")
  }

  const updates: Partial<CategoryRecord> = {
    ...input,
    name: input.name || undefined,
    color: input.color || undefined,
    icon: input.icon || undefined,
    isRegular: input.isRegular || undefined
  }

  updateOneCategory(id, updates)

  return getCategory(id)!
}

export const deleteCategory: MutationResolvers["deleteCategory"] = (_, { id }) => {
  const category = getCategory(id)

  if (!category) {
    throw new Error("Not found")
  }

  softDeleteCategory(id)

  return category
}

export const reorderCategories: MutationResolvers["reorderCategories"] = (_, { orderedIds }) => {
  setCategoryOrder(orderedIds)

  return findCategories()
}

export const Category: Resolvers["Category"] = {
  id: (category) => category.id,
  name: (category) => category.name,
  color: (category) => category.color,
  icon: (category) => category.icon,

  budget: async (category, _, context) =>
    category.budget != null && category.budgetCurrencyId
      ? {
          amount: category.budget,
          currency: await context.data.currency.load(category.budgetCurrencyId!)
        }
      : null,

  budgetCurrency: (category, _, context) =>
    category.budgetCurrencyId ? context.data.currency.load(category.budgetCurrencyId) : null,

  isRegular: (category) => category.isRegular,
  sortOrder: (category) => category.sortOrder,
  createdAt: (category) => category.createdAt,
  updatedAt: (category) => category.updatedAt
}
