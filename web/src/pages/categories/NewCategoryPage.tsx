import { useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import InnerPageWrapper from "../../components/InnerPageWrapper.tsx"
import CategoryForm from "../../components/categories/CategoryForm.tsx"
import { CreateCategoryMutationVariables } from "../../graphql-types.ts"
import { useCreateCategory } from "../../graphql/mutations/createCategoryMutation.ts"

const NewCategoryPage: Component = () => {
  const navigate = useNavigate()

  const createCategory = useCreateCategory({
    onSuccess: () => {
      toast.success("Category created")
      navigate("/settings")
    }
  })

  const onSave = (input: CreateCategoryMutationVariables["input"]) => {
    createCategory({ input })
  }

  return (
    <InnerPageWrapper heading="New Category" backLink="/settings">
      <CategoryForm onSave={onSave} loading={createCategory.loading} />
    </InnerPageWrapper>
  )
}

export default NewCategoryPage
