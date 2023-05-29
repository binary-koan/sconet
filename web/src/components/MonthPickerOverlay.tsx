import { Component, JSX } from "solid-js"

export const MonthPickerOverlay: Component<{
  class?: string
  value?: string
  disableFutureDates?: boolean
  onChange?: (value: string) => void
  children: JSX.Element
}> = (props) => {
  let monthInput: HTMLInputElement | undefined

  return (
    <div class={`relative ${props.class}`} onClick={() => monthInput?.showPicker()}>
      {props.children}

      <input
        ref={monthInput}
        type="month"
        class="absolute inset-0 opacity-0"
        value={props.value}
        max={
          props.disableFutureDates
            ? `${new Date().toISOString().replace(/-\d+T.+/, "")}`
            : undefined
        }
        onChange={(e) => props.onChange?.(e.target.value)}
      />
    </div>
  )
}
