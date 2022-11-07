import { Component, JSX } from "solid-js"

const FormSwitch: Component<{
  label: JSX.Element
  name: string
  defaultValue?: boolean
}> = (props) => {
  return (
    <label class="relative mb-4 flex cursor-pointer items-center">
      <input type="checkbox" name={props.name} value="" class="peer sr-only" />
      <div class="peer h-6 w-11 rounded-full bg-gray-200 transition after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-violet-300" />
      <span class="ml-3 text-sm font-medium">{props.label}</span>
    </label>
  )
}

export default FormSwitch
