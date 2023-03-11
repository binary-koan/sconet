import { useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import CategoryForm from "../../components/categories/CategoryForm"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { CreateCategoryMutationVariables } from "../../graphql-types"
import { useCreateCategory } from "../../graphql/mutations/createCategoryMutation"

const NewCategoryPage: Component = () => {
  const navigate = useNavigate()

  const createCategory = useCreateCategory({
    onSuccess: () => {
      toast.success("Category created")
      navigate("/settings")
    },
    onError: (error) => {
      toast.error(error.message)
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
