import { CategoryRecord } from "../db/category"
import { findCategories } from "../db/category/findCategories"
import { getCategory } from "../db/category/getCategory"
import { insertCategory } from "../db/category/insertCategory"
import { softDeleteCategory } from "../db/category/softDeleteCategory"
import { updateOneCategory } from "../db/category/updateOneCategory"
import { MutationResolvers, QueryResolvers } from "../resolvers-types"

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
