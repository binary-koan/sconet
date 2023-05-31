import { Field, FormStore, getValue, setValue } from "@modular-forms/solid"
import { last } from "lodash"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, For, JSX, Show, createSignal } from "solid-js"
import { buildMonthDates } from "../../utils/buildMonthDates"
import { decrementMonth, incrementMonth, isSameDate, stripTime } from "../../utils/date"
import { MonthPickerOverlay } from "../MonthPickerOverlay"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"

export const FormDatePicker: Component<{
  of: FormStore<any, any>
  label: JSX.Element
  labelHidden?: boolean
  name: string
  type?: string
  class?: string
  maxDate?: string
}> = (props) => {
  // eslint-disable-next-line solid/reactivity
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
    setValue(props.of, props.name, stripTime(date))
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
        {(field, fieldProps) => (
          <>
            <input {...fieldProps} value={field.value || ""} style={{ display: "none" }} />

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

                <MonthPickerOverlay
                  class="mx-4 flex-1 text-center text-sm font-semibold"
                  value={field.value && field.value.replace(/-\d+$/, "")}
                  disableFutureDates
                  onChange={(value) =>
                    setDisplayedMonth({
                      year: parseInt(value.split("-")[0]),
                      monthNumber: parseInt(value.split("-")[1])
                    })
                  }
                >
                  {displayedMonthStart().toLocaleDateString("default", {
                    month: "long",
                    year: "numeric"
                  })}
                </MonthPickerOverlay>

                <Button
                  size="square"
                  variant="ghost"
                  aria-label="Next Month"
                  onClick={() => setDisplayedMonth(incrementMonth(displayedMonth()))}
                  disabled={
                    props.maxDate
                      ? new Date(stripTime(last(dates())!.date)) >= new Date(props.maxDate)
                      : false
                  }
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
                        class="flex h-8 w-8 flex-col items-center justify-center rounded-full border text-sm disabled:opacity-50"
                        data-testid="datepicker-date"
                        classList={{
                          "border-transparent": !isSameDate(date, new Date()),
                          "border-gray-200": isSameDate(date, new Date()),
                          "text-gray-400": !isCurrentMonth,
                          "hover:bg-gray-200": !isSelected(),
                          "bg-indigo-600 text-white hover:bg-indigo-700": isSelected()
                        }}
                        onClick={() => onSelect(date)}
                        disabled={
                          props.maxDate
                            ? new Date(stripTime(date)) > new Date(props.maxDate)
                            : false
                        }
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
