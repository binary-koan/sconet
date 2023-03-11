import { useNavigate, useRouteData } from "@solidjs/router"
import { Component, Show } from "solid-js"
import toast from "solid-toast"
import CategoryForm from "../../components/categories/CategoryForm"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import {
  GetCategoryQuery,
  GetCategoryQueryVariables,
  UpdateCategoryMutationVariables
} from "../../graphql-types"
import { useUpdateCategory } from "../../graphql/mutations/updateCategoryMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

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
    <InnerPageWrapper heading="Edit Category" backLink="/settings">
      <Show when={routeData.data()}>
        <CategoryForm
          category={routeData.data()!.category}
          onSave={onSave}
          loading={updateCategory.loading}
        />
      </Show>
    </InnerPageWrapper>
  )
}

export default EditCategoryPage
