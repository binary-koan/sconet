import { JSX, splitProps } from "solid-js"
import { inputClasses, InputProps } from "./Input"

export type InputGroupProps = JSX.IntrinsicElements["div"]

export const InputGroup = (allProps: InputGroupProps) => {
  const [props, elementProps] = splitProps(allProps, ["class"])

  return (
    <div
      class={`flex items-center ${inputClasses({ size: "custom" })} ${props.class}`}
      {...elementProps}
    />
  )
}

export type InputAddonProps = JSX.IntrinsicElements["div"]

export const InputAddon = (allProps: InputAddonProps) => {
  const [props, elementProps] = splitProps(allProps, ["class"])

  return <div class={`text-gray-600 first:pl-4 last:pr-4 ${props.class}`} {...elementProps} />
}

export const InputGroupInput = (allProps: InputProps) => {
  const [props, elementProps] = splitProps(allProps, ["class"])

  return (
    <input
      class={`-my-px h-10 flex-1 bg-transparent px-4 outline-0 ${props.class}`}
      {...elementProps}
    />
  )
}
