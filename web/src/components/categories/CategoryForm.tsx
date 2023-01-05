import { repeat } from "lodash"
import { Component, createSignal, onMount } from "solid-js"
import { CreateCategoryMutationVariables, FullCurrencyFragment } from "../../graphql-types"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { Button } from "../base/Button"
import { InputAddon, InputGroup, InputGroupInput } from "../base/InputGroup"
import { Form } from "../forms/Form"
import FormIconPicker from "../forms/FormIconPicker"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"
import FormOptionButtons from "../forms/FormOptionButtons"
import FormSwitch from "../forms/FormSwitch"

interface CategoryFormValues {
  name: string
  color: string
  icon: string
  budget: string
  isRegular?: string
}

const CategoryForm: Component<{
  category?: any
  onSave: (input: CreateCategoryMutationVariables["input"], id?: string) => void
  loading: boolean
}> = (props) => {
  const [currencies] = useCurrenciesQuery()
  const [selectedCurrency, setSelectedCurrency] = createSignal<FullCurrencyFragment | undefined>()

  const onSave = (data: CategoryFormValues) => {
    props.onSave(
      {
        ...data,
        budget: data.budget
          ? Math.floor(parseFloat(data.budget) * 10 ** (selectedCurrency()?.decimalDigits || 0))
          : null,
        isRegular: Boolean(data.isRegular)
      },
      props?.category?.id
    )
  }

  let form: HTMLFormElement | undefined

  onMount(() => {
    form?.addEventListener("click", (event) => {
      setTimeout(() => {
        const currencyId = new FormData(form).get("budgetCurrencyId")

        setSelectedCurrency(currencies()?.currencies.find((currency) => currency.id === currencyId))
      })
    })
  })

  return (
    <Form ref={form} onSave={onSave}>
      <FormInput label="Name" name="name" defaultValue={props.category?.name} />

      <FormOptionButtons
        label="Color"
        name="color"
        defaultValue={props.category?.color}
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

      <FormIconPicker name="icon" label="Icon" defaultValue={props.category?.icon} />

      <FormOptionButtons
        label="Budget Currency"
        name="budgetCurrencyId"
        defaultValue={props.category?.budgetCurrencyId}
        options={
          currencies()?.currencies?.map((currency) => ({
            value: currency.id,
            content: currency.code
          })) || []
        }
      />

      <FormInputGroup
        label="Budget"
        name="budget"
        type="number"
        defaultValue={props.category?.budget?.decimalAmount}
        render={(props) => (
          <InputGroup>
            <InputAddon>{selectedCurrency()?.symbol}</InputAddon>
            <InputGroupInput
              {...props}
              step={
                selectedCurrency()?.decimalDigits
                  ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
                  : "1"
              }
            />
          </InputGroup>
        )}
      />

      <FormSwitch
        label="Regular"
        name="isRegular"
        defaultValue={props.category?.isRegular != null ? props.category.isRegular : true}
      />

      <Button type="submit" colorScheme="primary" disabled={props.loading}>
        Save
      </Button>
    </Form>
  )
}

export default CategoryForm
