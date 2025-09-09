import { Form, FormStore, getValue } from "@modular-forms/solid"
import { noop } from "lodash"
import { IconFilter } from "@tabler/icons-solidjs"
import { Component, JSX, Show } from "solid-js"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery.ts"
import { namedIcons } from "../../utils/namedIcons.ts"
import CategoryIndicator from "../CategoryIndicator.tsx"
import FormInput from "../forms/FormInput.tsx"
import FormOptionButtons from "../forms/FormOptionButtons.tsx"
import { stripTime } from "../../utils/date.ts"

export type TransactionFilterValues = {
  dateFrom?: string
  dateUntil?: string
  minAmount?: string
  maxAmount?: string
  keyword?: string
  categoryIds?: string[]
  uncategorized?: boolean
}

export const TransactionFilters: Component<{
  form: FormStore<TransactionFilterValues, undefined>
}> = (props) => {
  const data = useCategoriesQuery(() => ({ archived: false, today: stripTime(new Date()) }))

  return (
    <div class="mb-4 bg-white p-4 shadow-sm lg:rounded" data-testid="filters-container">
      <Form of={props.form} onSubmit={noop}>
        <FormInput
          of={props.form}
          name="keyword"
          type="search"
          label={<FilterLabel of={props.form} name="keyword" label="Filter" />}
        />

        <div class="flex gap-2">
          <FormInput
            of={props.form}
            name="dateFrom"
            type="date"
            label={<FilterLabel of={props.form} name="dateFrom" label="Show from" />}
            wrapperClass="flex-1"
          />
          <FormInput
            of={props.form}
            name="dateUntil"
            type="date"
            label={<FilterLabel of={props.form} name="dateUntil" label="Show until" />}
            wrapperClass="flex-1"
          />
        </div>

        <div class="flex gap-2">
          <FormInput
            of={props.form}
            name="minAmount"
            type="number"
            label={<FilterLabel of={props.form} name="minAmount" label="Value over (cents)" />}
            wrapperClass="flex-1"
          />
          <FormInput
            of={props.form}
            name="maxAmount"
            type="number"
            label={<FilterLabel of={props.form} name="maxAmount" label="Value under (cents)" />}
            wrapperClass="flex-1"
          />
        </div>

        <FormOptionButtons
          of={props.form}
          name="categoryIds"
          label={<FilterLabel of={props.form} name="categoryIds" label="Categories" />}
          multiple={true}
          options={[
            {
              value: "",
              content: (
                <div class="flex items-center gap-2">
                  <CategoryIndicator class="h-6 w-6" />
                  Uncategorized
                </div>
              )
            },

            ...(data()?.categories || []).map((category) => ({
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
            }))
          ]}
        />
      </Form>
    </div>
  )
}

const FilterLabel: Component<{
  label: JSX.Element
  of: FormStore<TransactionFilterValues, undefined>
  name: keyof TransactionFilterValues
}> = (props) => {
  const isActive = () => {
    const value = getValue(props.of, props.name)

    return Array.isArray(value) ? Boolean(value.length) : Boolean(value)
  }

  return (
    <span class="flex items-center gap-1">
      {props.label}
      <Show when={isActive()}>
        <span class="text-indigo-500">
          <IconFilter />
        </span>
      </Show>
    </span>
  )
}
