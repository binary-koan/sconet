import { Button, Flex } from "@hope-ui/solid"
import { union } from "lodash"
import { Component, JSX } from "solid-js"

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
> = (props) => {
  return (
    <Flex wrap="wrap">
      {props.options.map(({ value: optionValue, content, props, buttonProps }) => (
        <div key={optionValue} {...props}>
          <OptionButton
            optionValue={optionValue}
            valueProps={{ value: props.value, onChange: props.onChange, multiple: props.multiple }}
            {...buttonProps}
          >
            {content}
          </OptionButton>
        </div>
      ))}
    </Flex>
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

  const isCurrent =
    typeof props.valueProps.value === "string"
      ? props.valueProps.value === props.optionValue
      : props.valueProps.value?.includes(props.optionValue)

  return (
    <>
      <Button
        size="sm"
        colorScheme={isCurrent ? "primary" : "neutral"}
        onClick={onClick}
        {...props}
      >
        {props.children}
      </Button>
    </>
  )
}
