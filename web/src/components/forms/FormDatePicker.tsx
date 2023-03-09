import { Field, FormState, getValue, setValue } from "@modular-forms/solid"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, createSignal, For, JSX, Show } from "solid-js"
import { buildMonthDates } from "../../utils/buildMonthDates"
import { decrementMonth, incrementMonth, isSameDate } from "../../utils/date"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"

export const FormDatePicker: Component<{
  of: FormState<any>
  label: JSX.Element
  labelHidden?: boolean
  name: string
  type?: string
  class?: string
}> = (props) => {
  const formatDate = (value: Date) => value.toISOString().split("T")[0]

  const initialValue = getValue(props.of, props.name)
  const [displayedMonth, setDisplayedMonth] = createSignal(
    initialValue
      ? {
          year: new Date(initialValue).getFullYear(),
          monthNumber: new Date(initialValue).getMonth() + 1
        }
      : { year: new Date().getFullYear(), monthNumber: new Date().getMonth() + 1 }
  )
  const displayedMonthStart = () =>
    new Date(displayedMonth().year, displayedMonth().monthNumber - 1)

  const onSelect = (date: Date) => {
    setValue(props.of, props.name, formatDate(date))
  }

  const dates = () => {
    return buildMonthDates(displayedMonth().year, displayedMonth().monthNumber)
  }

  return (
    <FormControl class={props.class}>
      <Show when={props.label}>
        <FormLabel class={props.labelHidden ? "sr-only" : ""}>{props.label}</FormLabel>
      </Show>
      <Field of={props.of} name={props.name}>
        {(field) => (
          <>
            <input {...field.props} value={field.value || ""} style={{ display: "none" }} />

            <div class="flex flex-col items-center">
              <div class="mx-auto mb-4 flex items-center justify-center rounded">
                <Button
                  size="square"
                  variant="ghost"
                  aria-label="Previous Month"
                  onClick={() => setDisplayedMonth(decrementMonth(displayedMonth()))}
                >
                  <TbArrowLeft size="1.25em" />
                </Button>

                <span class="mx-4 flex-1 text-center text-sm font-semibold">
                  {displayedMonthStart().toLocaleDateString("default", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>

                <Button
                  size="square"
                  variant="ghost"
                  aria-label="Next Month"
                  onClick={() => setDisplayedMonth(incrementMonth(displayedMonth()))}
                >
                  <TbArrowRight size="1.25em" />
                </Button>
              </div>

              <div class="grid grid-cols-7 justify-center gap-1">
                <For each={dates().slice(0, 7)}>
                  {({ date }) => (
                    <div class="text-center text-xs font-semibold">
                      {date.toLocaleDateString("default", { weekday: "short" })}
                    </div>
                  )}
                </For>
                <For each={dates()}>
                  {({ date, isCurrentMonth }) => {
                    const isSelected = () => field.value && isSameDate(date, new Date(field.value))

                    return (
                      <button
                        type="button"
                        class="flex h-8 w-8 flex-col items-center justify-center rounded-full border text-sm"
                        classList={{
                          "border-transparent": !isSameDate(date, new Date()),
                          "border-gray-200": isSameDate(date, new Date()),
                          "text-gray-400": !isCurrentMonth,
                          "hover:bg-gray-200": !isSelected(),
                          "bg-indigo-600 text-white hover:bg-indigo-700": isSelected()
                        }}
                        onClick={() => onSelect(date)}
                      >
                        {date.getDate()}
                      </button>
                    )
                  }}
                </For>
              </div>
            </div>
          </>
        )}
      </Field>
    </FormControl>
  )
}
