import { useNavigate, useRouteData } from "@solidjs/router"
import { Component, Resource, Show } from "solid-js"
import toast from "solid-toast"
import CategoryForm from "../../components/categories/CategoryForm"
import FormPageWrapper from "../../components/FormPageWrapper"
import { GetCategoryQuery, UpdateCategoryMutationVariables } from "../../graphql-types"
import { CATEGORIES_QUERY } from "../../graphql/queries/categoriesQuery"
import { GET_CATEGORY_QUERY } from "../../graphql/queries/getCategoryQuery"
import { useMutation } from "../../graphqlClient"
import { gql } from "../../utils/gql"

export interface EditCategoryPageData {
  data: Resource<GetCategoryQuery>
}

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      color
      icon
      budget {
        decimalAmount
        formatted
      }
      createdAt
      updatedAt
    }
  }
`

const EditCategoryPage: Component = () => {
  const routeData = useRouteData<EditCategoryPageData>()
  const navigate = useNavigate()

  const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY_MUTATION, {
    onSuccess: () => {
      toast.success("Category updated")
      navigate("/settings")
    },
    onError: (error) => {
      toast.error(error.message)
    },
    refetchQueries: [CATEGORIES_QUERY, GET_CATEGORY_QUERY]
  })

  const onSave = (input: UpdateCategoryMutationVariables["input"], id?: string) => {
    updateCategory({ id, input })
  }

  return (
    <FormPageWrapper heading="Edit Category" backLink="/settings">
      <Show when={routeData.data()}>
        <CategoryForm category={routeData.data()!.category} onSave={onSave} loading={loading} />
      </Show>
    </FormPageWrapper>
  )
}

export default EditCategoryPage
