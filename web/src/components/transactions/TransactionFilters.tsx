import { Box, HopeProps } from "@hope-ui/solid"
import { Component, splitProps } from "solid-js"
import { CategoryOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { Directive } from "../../types"
import { gql } from "../../utils/gql"
import { namedIcons } from "../../utils/namedIcons"
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

const TransactionFilters: Component<
  HopeProps & {
    form: Directive
  }
> = (props) => {
  const [data] = useQuery<CategoryOptionsQuery>(categoriesQuery)
  const [{ form }, otherProps] = splitProps(props, ["form"])

  return (
    <Box {...otherProps} background="$neutral1" padding="$4" marginBottom="$4" boxShadow="$xs">
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
                <Box display="flex" alignItems="center" gap="$2">
                  <CategoryIndicator
                    size="$6"
                    icon={namedIcons[category.icon]}
                    color={category.color}
                  />
                  {category.name}
                </Box>
              )
            })) || []
          }
        />
      </form>
    </Box>
  )
}

export default TransactionFilters
