import { PickerModal } from "@/components/ui/picker-modal"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "./ui/icon"

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  maxDate?: Date
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function DatePicker({ value, onChange, maxDate = new Date() }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(value)

  const handleDateSelect = (day: number) => {
    const newDate = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
    onChange(newDate)
    setOpen(false)
  }

  const goToPreviousMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    const nextMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    if (nextMonth <= maxDate) {
      setCalendarMonth(nextMonth)
    }
  }

  const renderCalendar = () => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const maxDateStr = formatDate(maxDate)
    const selectedStr = formatDate(value)

    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    const weeks: (number | null)[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    const todayStr = formatDate(new Date())

    return weeks.map((week, weekIndex) => (
      <View key={weekIndex} className="flex-row">
        {week.map((day, dayIndex) => {
          if (day === null) {
            return <View key={dayIndex} className="h-10 flex-1" />
          }

          const dateStr = formatDate(new Date(year, month, day))
          const isSelected = dateStr === selectedStr
          const isToday = dateStr === todayStr
          const isFuture = dateStr > maxDateStr

          return (
            <TouchableOpacity
              key={dayIndex}
              onPress={() => !isFuture && handleDateSelect(day)}
              disabled={isFuture}
              style={{ flex: 1 }}
            >
              <View
                className={cn(
                  "h-10 flex-1 items-center justify-center rounded-full",
                  isSelected && "bg-primary",
                  isToday && !isSelected && "border-primary border"
                )}
              >
                <Text
                  className={cn(
                    isSelected && "text-primary-foreground",
                    isFuture && "text-muted-foreground/40"
                  )}
                >
                  {day}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    ))
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setCalendarMonth(value)
          setOpen(true)
        }}
      >
        <View className="border-input bg-background flex h-10 flex-row items-center gap-3 rounded-md border px-3 shadow-sm shadow-black/5">
          <Icon as={CalendarIcon} className="size-5 text-muted-foreground" />
          <Text className="flex-1">{formatDisplayDate(value)}</Text>
        </View>
      </TouchableOpacity>

      <PickerModal open={open} onClose={() => setOpen(false)} title="Select Date" scrollable>
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={goToPreviousMonth}>
            <View className="p-2">
              <Icon as={ChevronLeftIcon} className="size-5 text-foreground" />
            </View>
          </TouchableOpacity>
          <Text variant="large">
            {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <View className="p-2">
              <Icon as={ChevronRightIcon} className="size-5 text-foreground" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-2 flex-row">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <View key={day} className="flex-1 items-center">
              <Text variant="small" className="text-muted-foreground">
                {day}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-1">{renderCalendar()}</View>
      </PickerModal>
    </>
  )
}
