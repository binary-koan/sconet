import { createForm, Form, getValue } from "@modular-forms/solid"
import { repeat, upperFirst } from "lodash"
import { Component, JSX, Show } from "solid-js"
import { CreateCategoryMutationVariables, FullCategoryFragment } from "../../graphql-types"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"
import FormIconPicker from "../forms/FormIconPicker"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"
import { toCents } from "../transactions/AmountEditor"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../../utils/categoryColors"

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
      budgetCurrencyId: props.category?.budget?.currency.id || "",
      isRegular: props.category?.isRegular != null ? props.category.isRegular : true
    }
  })

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.id === getValue(form, "budgetCurrencyId"))

  const onSave = ({ budget, budgetCurrencyId, ...data }: CategoryFormValues) => {
    props.onSave(
      {
        ...data,
        budgetCurrencyId: budgetCurrencyId || null,
        budgetCents: budget ? toCents(budget, selectedCurrency()) : null,
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
        options={
          [
            { value: "gray", content: <ColorOptionContent value="gray" /> },
            { value: "red", content: <ColorOptionContent value="red" /> },
            { value: "orange", content: <ColorOptionContent value="orange" /> },
            { value: "yellow", content: <ColorOptionContent value="yellow" /> },
            { value: "green", content: <ColorOptionContent value="green" /> },
            { value: "teal", content: <ColorOptionContent value="teal" /> },
            { value: "blue", content: <ColorOptionContent value="blue" /> },
            { value: "cyan", content: <ColorOptionContent value="cyan" /> },
            { value: "purple", content: <ColorOptionContent value="purple" /> },
            { value: "pink", content: <ColorOptionContent value="pink" /> },
            { value: "indigo", content: <ColorOptionContent value="indigo" /> },
            { value: "fuchsia", content: <ColorOptionContent value="fuchsia" /> }
          ] satisfies Array<{ value: CategoryColor; content: JSX.Element }>
        }
      />

      <FormIconPicker of={form} name="icon" label="Icon" />

      <FormOptionButtons
        of={form}
        label="Budget Currency"
        name="budgetCurrencyId"
        options={[{ value: "", content: "None" }].concat(
          currencies()?.currencies?.map((currency) => ({
            value: currency.id,
            content: `${currency.code} (${currency.name})`
          })) || []
        )}
      />

      <Show when={selectedCurrency()}>
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
      </Show>

      <FormSwitch of={form} label="Regular" name="isRegular" />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

const ColorOptionContent: Component<{ value: CategoryColor }> = (props) => {
  return (
    <>
      <div
        class={`mr-1 h-3 w-3 rounded-full border border-gray-200 ${
          CATEGORY_BACKGROUND_COLORS[props.value]
        }`}
      />
      {upperFirst(props.value)}
    </>
  )
}

export default CategoryForm
