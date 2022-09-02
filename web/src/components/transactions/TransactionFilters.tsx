import { Box, HopeProps, Input, Text } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { CategoryOptionsQuery } from "../../graphql-types"
import { createQuery } from "../../graphqlClient"
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

const TransactionFilters = ({
  values,
  setValues,
  ...props
}: HopeProps & {
  values: TransactionFilterValues
  setValues: (values: TransactionFilterValues) => void
}) => {
  const [data] = createQuery<CategoryOptionsQuery>(categoriesQuery)

  return (
    <Box {...props} background="$neutral1" padding="$4" marginBottom="$4" boxShadow="xs">
      <Input
        type="search"
        placeholder="Filter ..."
        aria-label="Filter by keyword"
        background="$neutral1"
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.currentTarget.value })}
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
        value={formatDateTimeForInput(values.dateFrom)}
        onChange={(e) => setValues({ ...values, dateFrom: e.currentTarget.value })}
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
        value={formatDateTimeForInput(values.dateUntil)}
        onChange={(e) => setValues({ ...values, dateUntil: e.currentTarget.value })}
      />

      <Text fontSize="xs" fontWeight="bold" color="gray.500" marginTop="$4" marginBottom="$2">
        Categories
      </Text>
      <OptionButtons
        multiple={true}
        value={values.categoryIds || []}
        onChange={(categoryIds) => setValues({ ...values, categoryIds })}
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
