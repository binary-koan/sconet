import { Box, Button, Text } from "@hope-ui/solid"
import { union } from "lodash"
import { Component, For } from "solid-js"
import { CategoryOptionsQuery } from "../../graphql-types"
import { useQuery } from "../../graphqlClient"
import { gql } from "../../utils/gql"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"

export type CategoryOption = CategoryOptionsQuery["categories"][0]

export type ValueProps =
  | {
      multiple: false
      value: CategoryOption | undefined
      onChange: (category: CategoryOption) => void
    }
  | {
      multiple: true
      value: CategoryOption[]
      onChange: (categories: CategoryOption[]) => void
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

const CategoryPicker: Component<ValueProps> = (props) => {
  const [data] = useQuery<CategoryOptionsQuery>(categoriesQuery)

  return (
    <Box display="flex" flexDirection="column" gap="2">
      <For each={data()?.categories}>
        {(category) => <CategoryOption category={category} valueProps={props} />}
      </For>
    </Box>
  )
}

export default CategoryPicker

const CategoryOption: Component<{
  category: CategoryOption
  valueProps: ValueProps
}> = (props) => {
  const onClick = () => {
    // For some reason TS complains without the === true and === false
    if (props.valueProps.multiple === true) {
      if (props.valueProps.value.some((item) => item.id === props.category.id)) {
        props.valueProps.onChange(
          props.valueProps.value.filter((item) => item.id !== props.category.id)
        )
      } else {
        props.valueProps.onChange(union(props.valueProps.value, [props.category]))
      }
    }

    if (props.valueProps.multiple === false) {
      props.valueProps.onChange(props.category)
    }
  }

  const isCurrent = () =>
    props.valueProps.value &&
    (Array.isArray(props.valueProps.value)
      ? props.valueProps.value.some((item) => item.id === props.category.id)
      : props.valueProps.value.id === props.category.id)

  return (
    <Button
      size="sm"
      display="block"
      width="full"
      colorScheme={isCurrent() ? "primary" : "neutral"}
      variant={isCurrent() ? "solid" : "ghost"}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" gap="2">
        <CategoryIndicator
          size="6"
          icon={namedIcons[props.category.icon]}
          color={props.category.color}
        />
        <Text minWidth="0" noOfLines={1}>
          {props.category.name}
        </Text>
      </Box>
    </Button>
  )
}
