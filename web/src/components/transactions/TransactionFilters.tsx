import { Form, FormState } from "@modular-forms/solid"
import { Component } from "solid-js"
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
  const data = useCategoriesQuery()

  return (
    <div class="mb-4 bg-white p-4 shadow-sm lg:rounded">
      <Form of={props.form} onSubmit={() => {}}>
        <FormInput of={props.form} name="keyword" type="search" label="Filter" />

        <div class="flex gap-2">
          <FormInput
            of={props.form}
            name="dateFrom"
            type="date"
            label="Show from"
            wrapperClass="flex-1"
          />
          <FormInput
            of={props.form}
            name="dateUntil"
            type="date"
            label="Show until"
            wrapperClass="flex-1"
          />
        </div>

        <div class="flex gap-2">
          <FormInput
            of={props.form}
            name="minAmount"
            type="number"
            label="Value over (cents)"
            wrapperClass="flex-1"
          />
          <FormInput
            of={props.form}
            name="maxAmount"
            type="number"
            label="Value under (cents)"
            wrapperClass="flex-1"
          />
        </div>

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
