import { Button, Flex } from "@hope-ui/solid"
import { union } from "lodash"
import { JSX } from "solid-js"

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

const OptionButtons = ({
  options,
  multiple,
  value,
  onChange
}: ValueProps & {
  options: Array<{
    value: string
    content: JSX.Element
    props?: any
    buttonProps?: any
  }>
}) => {
  return (
    <Flex wrap="wrap">
      {options.map(({ value: optionValue, content, props, buttonProps }) => (
        <div key={optionValue} {...props}>
          <OptionButton
            optionValue={optionValue}
            valueProps={{ value, onChange, multiple }}
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

function OptionButton({
  children,
  optionValue,
  valueProps,
  ...props
}: {
  valueProps: ValueProps
  optionValue: string
  children: JSX.Element
}) {
  const onClick = () => {
    // For some reason TS complains without the === true and === false. Because non-strict maybe?
    if (valueProps.multiple === true) {
      if (valueProps.value?.includes(optionValue)) {
        valueProps.onChange(
          valueProps.value?.filter((item) => item !== optionValue) || [optionValue]
        )
      } else {
        valueProps.onChange(union(valueProps.value, [optionValue]))
      }
    }

    if (valueProps.multiple === false) {
      valueProps.onChange(optionValue)
    }
  }

  const isCurrent =
    typeof valueProps.value === "string"
      ? valueProps.value === optionValue
      : valueProps.value?.includes(optionValue)

  return (
    <>
      <Button
        size="sm"
        colorScheme={isCurrent ? "primary" : "neutral"}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
    </>
  )
}
