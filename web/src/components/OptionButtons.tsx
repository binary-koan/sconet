import { union } from "lodash"
import { Component, For, JSX, splitProps } from "solid-js"
import { Button } from "./base/Button"

type ValueProps =
  | {
      multiple: false
      value: string
      onChange: (value: string) => void
    }
  | {
      multiple: true
      value: string[]
      onChange: (value: string[]) => void
    }

const OptionButtons: Component<
  ValueProps & {
    options: Array<{
      value: string
      content: JSX.Element
      props?: any
      buttonProps?: any
    }>
  }
> = (allProps) => {
  const [optionsProps, valueProps] = splitProps(allProps, ["options"])

  return (
    <div class="flex flex-wrap gap-1">
      <For each={optionsProps.options}>
        {({ value: optionValue, content, props, buttonProps }) => (
          <div {...props}>
            <OptionButton optionValue={optionValue} valueProps={valueProps} {...buttonProps}>
              {content}
            </OptionButton>
          </div>
        )}
      </For>
    </div>
  )
}

export default OptionButtons

const OptionButton: Component<{
  valueProps: ValueProps
  optionValue: string
  children: JSX.Element
}> = (props) => {
  const onClick = () => {
    // For some reason TS complains without the === true and === false. Because non-strict maybe?
    if (props.valueProps.multiple === true) {
      if (props.valueProps.value?.includes(props.optionValue)) {
        props.valueProps.onChange(
          props.valueProps.value?.filter((item) => item !== props.optionValue) || [
            props.optionValue
          ]
        )
      } else {
        props.valueProps.onChange(union(props.valueProps.value, [props.optionValue]))
      }
    }

    if (props.valueProps.multiple === false) {
      props.valueProps.onChange(props.optionValue)
    }
  }

  const isCurrent = () =>
    typeof props.valueProps.value === "string"
      ? props.valueProps.value === props.optionValue
      : props.valueProps.value?.includes(props.optionValue)

  return (
    <>
      <Button
        size="sm"
        colorScheme={isCurrent() ? "primary" : "neutral"}
        onClick={onClick}
        {...props}
      >
        {props.children}
      </Button>
    </>
  )
}
