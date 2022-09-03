import { InputGroup, InputLeftAddon, Input, Button } from "@hope-ui/solid"
import { Component } from "solid-js"
import { CreateCategoryMutationVariables } from "../../graphql-types"
import { Form } from "../forms/Form"
import FormIconPicker from "../forms/FormIconPicker"
import FormInput from "../forms/FormInput"
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
  const onSave = (data: CategoryFormValues) => {
    props.onSave(
      {
        ...data,
        budget: data.budget ? parseInt(data.budget) : null,
        isRegular: Boolean(data.isRegular)
      },
      props?.category?.id
    )
  }

  return (
    <Form onSave={onSave}>
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

      <FormInput
        label="Budget"
        name="budget"
        type="number"
        defaultValue={props.category?.budget}
        render={(props) => (
          <InputGroup>
            <InputLeftAddon>¥</InputLeftAddon>
            <Input {...props} />
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
