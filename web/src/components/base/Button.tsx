import { Link, LinkProps } from "@solidjs/router"
import { JSX, splitProps } from "solid-js"
import LoadingBar from "../LoadingBar"

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
    primary: "text-primary hover:bg-accent focus:bg-accent",
    danger: "text-destructive hover:bg-accent focus:bg-accent",
    neutral: "hover:bg-accent focus:bg-accent"
  },
  solid: {
    primary: "bg-indigo-600 border border-indigo-500 outline-1 outline-solid outline-indigo-700 shadow-xs hover:bg-indigo-800  focus:bg-indigo-800 text-white",
    danger: "bg-red-600 border border-red-500 outline-1 outline-solid outline-red-700 shadow-xs hover:bg-red-800 focus:bg-red-800 text-white",
    neutral: "bg-card border border-card outline-1 outline-solid outline-border shadow-xs hover:bg-accent focus:bg-accent"
  }
}

export type ButtonVariant = keyof typeof CLASSES
export type ButtonColor = keyof (typeof CLASSES)["ghost"]

export interface ButtonCustomProps {
  variant?: ButtonVariant
  colorScheme?: ButtonColor
  size?: ButtonSize
  loading?: boolean
}

export const buttonClasses = (props: ButtonCustomProps) =>
  `cursor-pointer flex items-center justify-center rounded-full font-medium transition focus:outline-0 disabled:pointer-events-none disabled:opacity-50 ${
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
    "type",
    "loading",
    "disabled",
    "children"
  ])

  return (
    <button
      class={`${buttonClasses(props)} ${props.class}`}
      classList={props.classList}
      type={props.type || "button"}
      disabled={props.disabled || props.loading}
      {...elementProps}
    >
      {props.loading ? <LoadingBar /> : props.children}
    </button>
  )
}

export type LinkButtonProps = LinkProps & Omit<ButtonCustomProps, "loading">
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
