import { JSX, splitProps } from "solid-js"

const SIZE_CLASSES = {
  lg: "text-lg lg:text-2xl"
}

export type HeadingSize = keyof typeof SIZE_CLASSES

export interface HeadingProps {
  size: HeadingSize
}

const headingClasses = (props: HeadingProps) =>
  `my-2 flex items-center px-4 font-semibold lg:my-4 ${SIZE_CLASSES[props.size]}`

//TODO: Can this be refactored with <Dynamic>? (trying to do that seems to break event handler parameters for some reason)

export const Heading1 = (allProps: JSX.IntrinsicElements["h1"] & { size: HeadingSize }) => {
  const [props, elementProps] = splitProps(allProps, ["class", "size"])

  return <h1 class={`${headingClasses(props)} ${props.class}`} {...elementProps} />
}

export const Heading2 = (allProps: JSX.IntrinsicElements["h2"] & { size: HeadingSize }) => {
  const [props, elementProps] = splitProps(allProps, ["class", "size"])

  return <h2 class={`${headingClasses(props)} ${props.class}`} {...elementProps} />
}

export const Heading3 = (allProps: JSX.IntrinsicElements["h3"] & { size: HeadingSize }) => {
  const [props, elementProps] = splitProps(allProps, ["class", "size"])

  return <h3 class={`${headingClasses(props)} ${props.class}`} {...elementProps} />
}
