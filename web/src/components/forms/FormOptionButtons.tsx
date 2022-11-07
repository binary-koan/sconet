import { Component, createSignal, For, JSX, Show, splitProps } from "solid-js"
import { RefProp } from "../../types"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"

const FormOptionButtons: Component<{
  ref?: RefProp<HTMLDivElement>
  label?: JSX.Element
  name: string
  options: Array<{
    value: string
    content: JSX.Element
    props?: any
    buttonProps?: any
  }>
  defaultValue?: string | number
}> = (props) => {
  const [currentValue, setCurrentValue] = createSignal(props.defaultValue)

  return (
    <FormControl ref={props.ref}>
      <Show when={props.label}>
        <FormLabel>{props.label}</FormLabel>
      </Show>
      <div class="flex flex-wrap gap-1">
        <For each={props.options}>
          {({ value, content, props: boxProps, buttonProps }) => (
            <div {...boxProps}>
              <OptionButton
                name={props.name}
                value={value}
                currentValue={currentValue()}
                setCurrentValue={setCurrentValue}
                {...buttonProps}
              >
                {content}
              </OptionButton>
            </div>
          )}
        </For>
      </div>
    </FormControl>
  )
}

export default FormOptionButtons

const OptionButton: Component<{
  name: string
  value: string
  currentValue: string
  setCurrentValue: (value: string) => void
  children: JSX.Element
}> = (allProps) => {
  const [props, otherProps] = splitProps(allProps, [
    "children",
    "name",
    "value",
    "currentValue",
    "setCurrentValue"
  ])

  return (
    <>
      <Button
        size="sm"
        colorScheme={props.value === props.currentValue ? "primary" : "neutral"}
        onClick={[props.setCurrentValue, props.value]}
        {...otherProps}
      >
        {props.children}
      </Button>
      <input
        type="radio"
        style={{ display: "none" }}
        name={props.name}
        value={props.value}
        checked={props.value === props.currentValue}
      />
    </>
  )
}
