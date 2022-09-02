import { Box, HopeProps, Input, Text } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Component } from "solid-js"
import { CategoryOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { categoryIcons } from "../../utils/categoryIcons"
import { formatDateTimeForInput } from "../../utils/formatters"
import CategoryIndicator from "../CategoryIndicator"
import OptionButtons from "../OptionButtons"

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
    values: TransactionFilterValues
    setValues: (values: TransactionFilterValues) => void
  }
> = (props) => {
  const [data] = useQuery<CategoryOptionsQuery>(categoriesQuery)

  return (
    <Box {...props} background="$neutral1" padding="$4" marginBottom="$4" boxShadow="xs">
      <Input
        type="search"
        placeholder="Filter ..."
        aria-label="Filter by keyword"
        background="$neutral1"
        value={props.values.keyword}
        onChange={(e) => props.setValues({ ...props.values, keyword: e.currentTarget.value })}
      />

      <Text
        as="label"
        for="transactionFilters[dateFrom]"
        display="block"
        fontSize="xs"
        fontWeight="bold"
        color="gray.500"
        marginTop="$4"
        marginBottom="$2"
      >
        Show from
      </Text>
      <Input
        id="transactionFilters[dateFrom]"
        type="date"
        background="$neutral1"
        value={formatDateTimeForInput(props.values.dateFrom)}
        onChange={(e) => props.setValues({ ...props.values, dateFrom: e.currentTarget.value })}
      />

      <Text
        as="label"
        for="transactionFilters[dateUntil]"
        display="block"
        fontSize="xs"
        fontWeight="bold"
        color="gray.500"
        marginTop="$4"
        marginBottom="$2"
      >
        Show until
      </Text>
      <Input
        type="date"
        id="transactionFilters[dateUntil]"
        background="$neutral1"
        value={formatDateTimeForInput(props.values.dateUntil)}
        onChange={(e) => props.setValues({ ...props.values, dateUntil: e.currentTarget.value })}
      />

      <Text fontSize="xs" fontWeight="bold" color="gray.500" marginTop="$4" marginBottom="$2">
        Categories
      </Text>
      <OptionButtons
        multiple={true}
        value={props.values.categoryIds || []}
        onChange={(categoryIds) => props.setValues({ ...props.values, categoryIds })}
        options={
          data()?.categories?.map((category) => ({
            value: category.id,
            content: (
              <Box display="flex" alignItems="center" gap="$2">
                <CategoryIndicator
                  size="$6"
                  icon={categoryIcons[category.icon]}
                  color={category.color}
                />
                {category.name}
              </Box>
            )
          })) || []
        }
      />
    </Box>
  )
}

export default TransactionFilters
