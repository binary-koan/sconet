import { JSX, splitProps } from "solid-js"

const SIZE_CLASSES = {
  lg: "text-lg lg:text-2xl"
}

export type HeadingSize = keyof typeof SIZE_CLASSES

export interface HeadingProps {
  size: HeadingSize
}

const headingClasses = (props: HeadingProps) =>
  `py-2 flex items-center px-4 font-semibold lg:pt-8 lg:pb-4 ${SIZE_CLASSES[props.size]}`

//TODO: Can this be refactored with <Dynamic>? (trying to do that seems to break event handler parameters for some reason)

export const PageHeader = (allProps: JSX.IntrinsicElements["h1"] & { size: HeadingSize }) => {
  const [props, elementProps] = splitProps(allProps, ["class", "size"])

  return <h1 class={`${headingClasses(props)} ${props.class}`} {...elementProps} />
}
