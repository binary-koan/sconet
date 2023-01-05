import { useNavigate, useRouteData } from "@solidjs/router"
import { Component, Show } from "solid-js"
import toast from "solid-toast"
import CategoryForm from "../../components/categories/CategoryForm"
import FormPageWrapper from "../../components/FormPageWrapper"
import {
  GetCategoryQuery,
  GetCategoryQueryVariables,
  UpdateCategoryMutationVariables
} from "../../graphql-types"
import { useUpdateCategory } from "../../graphql/mutations/updateCategoryMutation"
import { QueryResource } from "../../graphqlClient"

export interface EditCategoryPageData {
  data: QueryResource<GetCategoryQuery, GetCategoryQueryVariables>
}

const EditCategoryPage: Component = () => {
  const routeData = useRouteData<EditCategoryPageData>()
  const navigate = useNavigate()

  const updateCategory = useUpdateCategory({
    onSuccess: () => {
      toast.success("Category updated")
      navigate("/settings")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: UpdateCategoryMutationVariables["input"], id?: string) => {
    updateCategory({ id: id!, input })
  }

  return (
    <FormPageWrapper heading="Edit Category" backLink="/settings">
      <Show when={routeData.data()}>
        <CategoryForm
          category={routeData.data()!.category}
          onSave={onSave}
          loading={updateCategory.loading}
        />
      </Show>
    </FormPageWrapper>
  )
}

export default EditCategoryPage
