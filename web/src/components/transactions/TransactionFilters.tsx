import { Form, FormState, getValues } from "@modular-forms/solid"
import { Component, createEffect } from "solid-js"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import FormInput from "../forms/FormInput"
import FormOptionButtons from "../forms/FormOptionButtons"

export type TransactionFilterValues = {
  dateFrom?: string
  dateUntil?: string
  keyword?: string
  categoryIds?: string[]
  uncategorized?: boolean
}

const TransactionFilters: Component<{
  form: FormState<TransactionFilterValues>
}> = (props) => {
  const [data] = useCategoriesQuery()

  createEffect(() => console.log(getValues(props.form)))

  return (
    <div class="mb-4 bg-white p-4 shadow-sm lg:rounded">
      <Form of={props.form} onSubmit={() => {}}>
        <FormInput of={props.form} name="keyword" type="search" label="Filter" />

        <FormInput of={props.form} name="dateFrom" type="date" label="Show from" />

        <FormInput of={props.form} name="dateUntil" type="date" label="Show until" />

        <FormOptionButtons
          of={props.form}
          name="categoryIds"
          label="Categories"
          multiple={true}
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
      </Form>
    </div>
  )
}

export default TransactionFilters
