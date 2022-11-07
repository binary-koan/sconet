import { JSX, splitProps } from "solid-js"

const formControlClasses = () => "mb-4"

export const FormControl = (allProps: JSX.IntrinsicElements["div"]) => {
  const [props, elementProps] = splitProps(allProps, ["class"])

  return <div class={`${formControlClasses()} ${props.class}`} {...elementProps} />
}

const formLabelClasses = () => "block font-medium text-sm mb-1"

export const FormLabel = (allProps: JSX.IntrinsicElements["label"]) => {
  const [props, elementProps] = splitProps(allProps, ["class"])

  return <label class={`${formLabelClasses()} ${props.class}`} {...elementProps} />
}
