import { createForm, Form, getValue } from "@modular-forms/solid"
import { repeat } from "lodash"
import { Component } from "solid-js"
import { CreateCategoryMutationVariables, FullCategoryFragment } from "../../graphql-types"
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
  budget?: string
  budgetCurrencyId?: string
  isRegular?: boolean
}

const CategoryForm: Component<{
  category?: FullCategoryFragment
  onSave: (input: CreateCategoryMutationVariables["input"], id?: string) => void
  loading: boolean
}> = (props) => {
  const currencies = useCurrenciesQuery()
  const [form] = createForm<CategoryFormValues>({
    initialValues: {
      name: props.category?.name,
      color: props.category?.color,
      icon: props.category?.icon,
      budget: props.category?.budget?.budget.amountDecimal.toString(),
      budgetCurrencyId: props.category?.budget?.currency.id,
      isRegular: props.category?.isRegular != null ? props.category.isRegular : true
    }
  })

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "budgetCurrencyId"))

  const onSave = (data: CategoryFormValues) => {
    props.onSave(
      {
        ...data,
        budgetCents: data.budget
          ? Math.floor(
              parseFloat(data.budget || "0") * 10 ** (selectedCurrency()?.decimalDigits || 0)
            )
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

      <FormIconPicker of={form} name="icon" label="Icon" />

      <FormOptionButtons
        of={form}
        label="Budget Currency"
        name="budgetCurrencyId"
        options={
          currencies()?.currencies?.map((currency) => ({
            value: currency.id,
            content: `${currency.code} (${currency.name})`
          })) || []
        }
      />

      <FormInputGroup
        of={form}
        label="Budget"
        name="budget"
        inputmode="decimal"
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
