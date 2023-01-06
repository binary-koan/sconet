import { Component } from "solid-js"

export const FieldError: Component<{ error: string }> = (props) => {
  return <div class="mt-2 text-sm text-red-600">{props.error}</div>
}
