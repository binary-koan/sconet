import { IconChevronLeft, IconChevronRight } from "@tabler/icons-solidjs"
import { Component, createSignal, For } from "solid-js"
import { monthRange } from "../../utils/date"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

export const MonthPickerModal: Component<{
  isOpen: boolean
  initialDate: Date
  onClose: () => void
  onSelect: (dateFrom: Date, dateUntil: Date) => void
}> = (props) => {
  const [year, setYear] = createSignal(props.initialDate.getFullYear())

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = new Date(year(), monthIndex, 1)
    const [dateFrom, dateUntil] = monthRange(selectedDate)
    props.onSelect(dateFrom, dateUntil)
    props.onClose()
  }

  return (
    <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
      <ModalContent class="sm:max-w-sm">
        <ModalTitle>
          Select Month
          <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <div class="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="square"
            onClick={() => setYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <IconChevronLeft />
          </Button>
          <span class="text-lg font-semibold">{year()}</span>
          <Button
            variant="ghost"
            size="square"
            onClick={() => setYear((y) => y + 1)}
            aria-label="Next year"
          >
            <IconChevronRight />
          </Button>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <For each={MONTHS}>
            {(month, index) => {
              const isCurrentMonth = () =>
                year() === props.initialDate.getFullYear() &&
                index() === props.initialDate.getMonth()

              return (
                <button
                  type="button"
                  onClick={() => handleMonthSelect(index())}
                  class="rounded-md px-2 py-3 text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
                  classList={{
                    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300":
                      isCurrentMonth(),
                    "text-foreground": !isCurrentMonth()
                  }}
                >
                  {month.slice(0, 3)}
                </button>
              )
            }}
          </For>
        </div>
      </ModalContent>
    </Modal>
  )
}
