import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, createSignal, For, JSX } from "solid-js"
import { buildMonthDates } from "../../utils/buildMonthDates"
import { isSameDate } from "../../utils/date"
import { Button } from "../base/Button"
import { FormControl, FormLabel } from "../base/FormControl"

export const FormDatePicker: Component<{
  label: JSX.Element
  name: string
  type?: string
  defaultValue?: Date
}> = (props) => {
  const formatDate = (value: Date) => value.toISOString().split("T")[0]

  const [value, setValue] = createSignal(props.defaultValue)

  const [displayedMonth, setDisplayedMonth] = createSignal(
    props.defaultValue
      ? { year: props.defaultValue.getFullYear(), monthNumber: props.defaultValue.getMonth() + 1 }
      : { year: new Date().getFullYear(), monthNumber: new Date().getMonth() + 1 }
  )
  const displayedMonthStart = () =>
    new Date(displayedMonth().year, displayedMonth().monthNumber - 1)

  const formattedValue = () => {
    const currentValue = value()
    return currentValue && formatDate(currentValue)
  }

  const dates = () => {
    return buildMonthDates(displayedMonth().year, displayedMonth().monthNumber)
  }

  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <input name={props.name} value={formattedValue()} style={{ display: "none" }} />

      <div class="flex flex-col items-center">
        <div class="mx-auto mb-4 flex items-center justify-center rounded">
          <Button size="square" variant="ghost" aria-label="Previous Month">
            <TbArrowLeft size="1.25em" />
          </Button>

          <span class="mx-4 flex-1 text-center text-sm font-semibold">
            {displayedMonthStart().toLocaleDateString("default", {
              month: "long",
              year: "numeric"
            })}
          </span>

          <Button size="square" variant="ghost" aria-label="Next Month">
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
              const isSelected = () => value() && isSameDate(date, value()!)

              return (
                <button
                  class="flex h-8 w-8 flex-col items-center justify-center rounded-full text-sm"
                  classList={{
                    "text-gray-400": !isCurrentMonth,
                    "hover:bg-gray-200": !isSelected(),
                    "bg-violet-600 text-white hover:bg-violet-700": isSelected()
                  }}
                  onClick={() => setValue(date)}
                >
                  {date.getDate()}
                </button>
              )
            }}
          </For>
        </div>
      </div>
    </FormControl>
  )
}
