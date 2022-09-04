import { Alert } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { useNavigate } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import toast from "solid-toast"
import { EditCategoryByIdQuery, UpdateCategoryMutationVariables } from "../../graphql-types"
import { useMutation } from "../../graphqlClient"
import { Cell } from "../Cell"
import FormPageWrapper from "../FormPageWrapper"
import LoadingBar from "../LoadingBar"
import CategoryForm from "./CategoryForm"

export const EDIT_CATEGORY_QUERY = gql`
  query EditCategoryById($id: String!) {
    category: category(id: $id) {
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

const Loading = () => <LoadingBar />

const Failure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

const Success: Component<{ data: EditCategoryByIdQuery }> = (props) => {
  const navigate = useNavigate()

  const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY_MUTATION, {
    onSuccess: () => {
      toast.success("Category updated")
      navigate("/settings")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSave = (input: UpdateCategoryMutationVariables["input"], id?: string) => {
    updateCategory({ id, input })
  }

  return (
    <FormPageWrapper heading="Edit Category" backLink="/settings">
      <CategoryForm category={props.data.category} onSave={onSave} loading={loading} />
    </FormPageWrapper>
  )
}

export const EditCategoryCell: Component<{
  data: Resource<EditCategoryByIdQuery>
}> = (props) => {
  return <Cell data={props.data as any} loading={Loading} failure={Failure} success={Success} />
}
