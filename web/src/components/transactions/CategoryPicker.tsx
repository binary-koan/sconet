import { union } from "lodash"
import { Component, For } from "solid-js"
import { FullCategoryFragment } from "../../graphql-types"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { namedIcons } from "../../utils/namedIcons"
import { Button } from "../base/Button"
import CategoryIndicator from "../CategoryIndicator"

export type ValueProps =
  | {
      multiple: false
      value: FullCategoryFragment | undefined
      onChange: (category: FullCategoryFragment) => void
    }
  | {
      multiple: true
      value: FullCategoryFragment[]
      onChange: (categories: FullCategoryFragment[]) => void
    }

const CategoryPicker: Component<ValueProps> = (props) => {
  const [data] = useCategoriesQuery()

  return (
    <div class="flex flex-col gap-2">
      <For each={data()?.categories}>
        {(category) => <CategoryOption category={category} valueProps={props} />}
      </For>
    </div>
  )
}

export default CategoryPicker

const CategoryOption: Component<{
  category: FullCategoryFragment
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
      class="block w-full gap-2"
      colorScheme={isCurrent() ? "primary" : "neutral"}
      variant={isCurrent() ? "solid" : "ghost"}
      onClick={onClick}
    >
      <CategoryIndicator
        class="h-6 w-6"
        icon={namedIcons[props.category.icon]}
        color={props.category.color}
      />
      <div class="min-w-0 truncate">{props.category.name}</div>
    </Button>
  )
}
