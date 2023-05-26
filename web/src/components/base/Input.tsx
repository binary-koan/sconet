import { JSX, splitProps } from "solid-js"

const INPUT_SIZES = {
  md: "px-4 h-10",
  custom: ""
}

interface InputCustomProps {
  size?: keyof typeof INPUT_SIZES
  onEnter?: () => void
  onEscape?: () => void
}

export const inputClasses = (props: InputCustomProps) =>
  `border rounded border-gray-200 ring-0 ring-indigo-200 transition focus:border-indigo-400 focus:outline-0 focus:ring focus-within:border-indigo-400 focus-within:outline-0 focus-within:ring disabled:pointer-events-none disabled:opacity-50 ${
    INPUT_SIZES[props.size || "md"]
  }`

export type InputProps = JSX.IntrinsicElements["input"] & InputCustomProps

export const Input = (allProps: InputProps) => {
  const [props, elementProps] = splitProps(allProps, ["size", "class", "onEnter", "onEscape"])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      props.onEnter?.()
    } else if (e.key === "Escape") {
      props.onEscape?.()
    }
  }

  return (
    <input
      class={`${inputClasses(props)} ${props.class}`}
      onKeyDown={onKeyDown}
      {...elementProps}
    />
  )
}
