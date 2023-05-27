import { Link, LinkProps } from "@solidjs/router"
import { JSX, splitProps } from "solid-js"

const SIZES = {
  xs: "p-1 text-sm",
  sm: "px-2 h-8 text-sm",
  md: "px-4 h-10 text-base",
  square: "w-10 h-10 text-base",
  custom: ""
}

export type ButtonSize = keyof typeof SIZES

const CLASSES = {
  ghost: {
    primary: "text-indigo-600 hover:bg-gray-200 focus:bg-gray-200",
    danger: "text-red-600 hover:bg-gray-200 focus:bg-gray-200",
    neutral: "hover:bg-gray-200 focus:bg-gray-200"
  },
  solid: {
    primary: "bg-indigo-600 hover:bg-indigo-800  focus:bg-indigo-800 text-white",
    danger: "bg-red-600 hover:bg-red-800  focus:bg-red-800 text-white",
    neutral: "bg-gray-200 hover:bg-gray-300 focus:bg-gray-300"
  }
}

export type ButtonVariant = keyof typeof CLASSES
export type ButtonColor = keyof (typeof CLASSES)["ghost"]

export interface ButtonCustomProps {
  variant?: ButtonVariant
  colorScheme?: ButtonColor
  size?: ButtonSize
}

export const buttonClasses = (props: ButtonCustomProps) =>
  `flex items-center justify-center rounded font-medium transition focus:outline-0 disabled:pointer-events-none disabled:opacity-50 ${
    // eslint-disable-next-line solid/reactivity
    CLASSES[props.variant || "solid"][props.colorScheme || "neutral"]
    // eslint-disable-next-line solid/reactivity
  } ${SIZES[props.size || "md"]}`

export type ButtonProps = JSX.IntrinsicElements["button"] & ButtonCustomProps
export const Button = (allProps: ButtonProps) => {
  const [props, elementProps] = splitProps(allProps, [
    "class",
    "classList",
    "variant",
    "colorScheme",
    "size",
    "type"
  ])

  return (
    <button
      class={`${buttonClasses(props)} ${props.class}`}
      classList={props.classList}
      type={props.type || "button"}
      {...elementProps}
    />
  )
}

export type LinkButtonProps = LinkProps & ButtonCustomProps
export const LinkButton = (allProps: LinkButtonProps) => {
  const [props, elementProps] = splitProps(allProps, [
    "class",
    "classList",
    "variant",
    "colorScheme",
    "size"
  ])

  return (
    <Link
      class={`${buttonClasses(props)} ${props.class}`}
      classList={props.classList}
      {...elementProps}
    />
  )
}
