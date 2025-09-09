import { constant } from "lodash"
import { Component, For, JSX, children } from "solid-js"
import { FullCategoryFragment } from "../../graphql-types.ts"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery.ts"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../../utils/categoryColors.ts"
import { Dropdown, DropdownMenuItem } from "../Dropdown.tsx"
import { stripTime } from "../../utils/date.ts"

export const CategorySelect: Component<{
  value?: string
  onChange: (category: FullCategoryFragment) => void
  children: (selectedCategory: FullCategoryFragment | undefined) => JSX.Element
  filter?: (category: FullCategoryFragment) => boolean
}> = (props) => {
  const categories = useCategoriesQuery(() => ({ archived: false, today: stripTime(new Date()) }))

  const toggle = children(() =>
    props.children(categories()?.categories.find((account) => account.id === props.value))
  )

  return (
    <Dropdown
      closeOnItemClick
      content={
        <For each={categories()?.categories.filter(props.filter || constant(true))}>
          {(category) => (
            <DropdownMenuItem
              data-testid="category-item"
              class="text-sm"
              onClick={() => props.onChange(category)}
            >
              <div
                class={`h-2 w-2 rounded-full ${
                  CATEGORY_BACKGROUND_COLORS[category.color as CategoryColor]
                }`}
              />
              {category.name}
            </DropdownMenuItem>
          )}
        </For>
      }
    >
      {toggle()}
    </Dropdown>
  )
}
