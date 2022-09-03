import { gql } from "@solid-primitives/graphql"
import { Route, useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import CategoryForm from "../components/categories/CategoryForm"
import FormPageWrapper from "../components/FormPageWrapper"
import { CreateCategoryMutation, CreateCategoryMutationVariables } from "../graphql-types"
import { useMutation } from "../graphqlClient"

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`

const NewCategory: Component = () => {
  const navigate = useNavigate()

  const [createCategory, { loading }] = useMutation<
    CreateCategoryMutation,
    CreateCategoryMutationVariables
  >(CREATE_CATEGORY_MUTATION, {
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
    <FormPageWrapper heading="New Category" backLink="/settings">
      <CategoryForm onSave={onSave} loading={loading} />
    </FormPageWrapper>
  )
}

export const NewCategoryRoute: Component = () => {
  return <Route path="/categories/new" component={NewCategory} />
}
