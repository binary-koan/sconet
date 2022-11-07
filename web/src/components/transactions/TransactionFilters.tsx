import { Component } from "solid-js"
import { CategoryOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { Directive } from "../../types"
import { gql } from "../../utils/gql"
import { namedIcons } from "../../utils/namedIcons"
import { usedAsDirective } from "../../utils/usedAsDirective"
import CategoryIndicator from "../CategoryIndicator"
import FormInput from "../forms/FormInput"
import FormOptionButtons from "../forms/FormOptionButtons"

export interface TransactionFilterValues {
  dateFrom?: string
  dateUntil?: string
  keyword?: string
  categoryIds?: string[]
  uncategorized?: boolean
}

const categoriesQuery = gql`
  query CategoryOptions {
    categories {
      id
      name
      color
      icon
    }
  }
`

const TransactionFilters: Component<{
  form: Directive
}> = (props) => {
  const [data] = useQuery<CategoryOptionsQuery>(categoriesQuery)
  const { form } = props

  usedAsDirective(form)

  return (
    <div class="mb-4 bg-white p-4 shadow-sm lg:rounded">
      <form use:form>
        <FormInput name="keyword" type="search" label="Filter" />

        <FormInput name="dateFrom" type="date" label="Show from" />

        <FormInput name="dateUntil" type="date" label="Show until" />

        <FormOptionButtons
          name="categories"
          label="Categories"
          options={
            data()?.categories?.map((category) => ({
              value: category.id,
              content: (
                <div class="flex items-center gap-2">
                  <CategoryIndicator
                    class="h-6 w-6"
                    icon={namedIcons[category.icon]}
                    color={category.color}
                  />
                  {category.name}
                </div>
              )
            })) || []
          }
        />
      </form>
    </div>
  )
}

export default TransactionFilters
