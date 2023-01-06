import { createForm, Form, getValue } from "@modular-forms/solid"
import { repeat } from "lodash"
import { Component } from "solid-js"
import { CreateCategoryMutationVariables } from "../../graphql-types"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"
import FormIconPicker from "../forms/FormIconPicker"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"

type CategoryFormValues = {
  name: string
  color: string
  icon: string
  budget?: number
  budgetCurrencyId?: string
  isRegular?: string
}

const CategoryForm: Component<{
  category?: any
  onSave: (input: CreateCategoryMutationVariables["input"], id?: string) => void
  loading: boolean
}> = (props) => {
  const currencies = useCurrenciesQuery()
  const form = createForm<CategoryFormValues>({
    initialValues: {
      name: props.category?.name,
      color: props.category?.color,
      budget: props.category?.budget?.decimalAmount,
      budgetCurrencyId: props.category?.budgetCurrencyId,
      isRegular: props.category?.isRegular != null ? props.category.isRegular : true
    }
  })

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "budgetCurrencyId"))

  const onSave = (data: CategoryFormValues) => {
    props.onSave(
      {
        ...data,
        budget: data.budget
          ? Math.floor(data.budget * 10 ** (selectedCurrency()?.decimalDigits || 0))
          : null,
        isRegular: Boolean(data.isRegular)
      },
      props?.category?.id
    )
  }

  return (
    <Form of={form} onSubmit={onSave}>
      <FormInput of={form} label="Name" name="name" />

      <FormOptionButtons
        of={form}
        label="Color"
        name="color"
        options={[
          { value: "gray", content: "Gray" },
          { value: "red", content: "Red" },
          { value: "orange", content: "Orange" },
          { value: "yellow", content: "Yellow" },
          { value: "green", content: "Green" },
          { value: "teal", content: "Teal" },
          { value: "blue", content: "Blue" },
          { value: "cyan", content: "Cyan" },
          { value: "purple", content: "Purple" },
          { value: "pink", content: "Pink" }
        ]}
      />

      <FormIconPicker of={form} name="icon" label="Icon" defaultValue={props.category?.icon} />

      <FormOptionButtons
        of={form}
        label="Budget Currency"
        name="budgetCurrencyId"
        options={
          currencies()?.currencies?.map((currency) => ({
            value: currency.id,
            content: currency.code
          })) || []
        }
      />

      <FormInputGroup
        of={form}
        label="Budget"
        name="budget"
        type="number"
        before={<InputAddon>{selectedCurrency()?.symbol}</InputAddon>}
        step={
          selectedCurrency()?.decimalDigits
            ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
            : "1"
        }
      />

      <FormSwitch of={form} label="Regular" name="isRegular" />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default CategoryForm
