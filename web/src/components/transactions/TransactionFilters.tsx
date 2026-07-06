import { Form, FormStore, getValue } from "@modular-forms/solid"
import { noop } from "lodash"
import { IconFilter, IconX } from "@tabler/icons-solidjs"
import { Component, JSX, Show } from "solid-js"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { namedIcons } from "../../utils/namedIcons"
import CategoryIndicator from "../CategoryIndicator"
import FormInput from "../forms/FormInput"
import FormOptionButtons from "../forms/FormOptionButtons"
import { stripTime } from "../../utils/date"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"

export type TransactionFilterValues = {
  dateFrom?: string
  dateUntil?: string
  minAmount?: string
  maxAmount?: string
  keyword?: string
  categoryIds?: string[]
  uncategorized?: boolean
}

export const parseFilterValues = (value: string): TransactionFilterValues => {
  const data = JSON.parse(value)
  return {
    ...data,
    minAmount: data.minAmount?.toString(),
    maxAmount: data.maxAmount?.toString(),
    categoryIds: data.categoryIds?.map((categoryId: string | null) => categoryId || "") || []
  }
}

export const serializeFilterValues = (value: Partial<TransactionFilterValues>): string =>
  JSON.stringify({
    ...value,
    minAmount: value.minAmount != null ? parseInt(value.minAmount) : undefined,
    maxAmount: value.maxAmount != null ? parseInt(value.maxAmount) : undefined,
    categoryIds: value.categoryIds?.map((categoryId) => categoryId || null)
  })

export const TransactionFiltersModal: Component<{
  isOpen: boolean
  form: FormStore<TransactionFilterValues, undefined>
  clearFilters: () => void
  hasFilterValues: boolean
  hideDates?: boolean
  onClose: () => void
}> = (props) => (
  // Stays mounted while closed: unmounting the fields makes modular-forms
  // treat them as inactive and drops their values
  <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
    <ModalContent>
      <ModalTitle>
        Filters
        <ModalCloseButton onClick={props.onClose} />
      </ModalTitle>
      <TransactionFilters
        form={props.form}
        clearFilters={props.clearFilters}
        hasFilterValues={props.hasFilterValues}
        hideDates={props.hideDates}
      />
    </ModalContent>
  </Modal>
)

export const TransactionFilters: Component<{
  form: FormStore<TransactionFilterValues, undefined>
  clearFilters: () => void
  hasFilterValues: boolean
  hideDates?: boolean
}> = (props) => {
  const data = useCategoriesQuery(() => ({ archived: false, today: stripTime(new Date()) }))

  return (
    <div data-testid="filters-container">
      <Form of={props.form} onSubmit={noop}>
        <FormInput
          of={props.form}
          name="keyword"
          type="search"
          label={<FilterLabel of={props.form} name="keyword" label="Filter" />}
        />

        <Show when={!props.hideDates}>
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
        </Show>

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

      <Button
        variant="ghost"
        size="sm"
        class="gap-2"
        onClick={props.clearFilters}
        disabled={!props.hasFilterValues}
      >
        <IconX /> Clear filters
      </Button>
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
