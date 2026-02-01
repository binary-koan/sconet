import { Icon } from "@/components/ui/icon"
import { PickerModal } from "@/components/ui/picker-modal"
import { Text } from "@/components/ui/text"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native"
import { useState } from "react"
import { TouchableOpacity, View } from "react-native"

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

interface MonthPickerModalProps {
  open: boolean
  onClose: () => void
  initialDate: Date
  onSelect: (date: Date) => void
}

function YearSection({
  year,
  initialDate,
  onSelect
}: {
  year: number
  initialDate: Date
  onSelect: (monthIndex: number, year: number) => void
}) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  return (
    <View className="border-border mb-4 rounded-lg border p-2 pt-4">
      <Text className="mb-2 text-center text-lg font-semibold">{year}</Text>
      <View className="flex-row flex-wrap">
        {MONTHS.map((month, index) => {
          const isFuture = year > currentYear || (year === currentYear && index > currentMonth)
          const isSelected = year === initialDate.getFullYear() && index === initialDate.getMonth()

          if (isFuture) {
            return (
              <View key={month} className="w-1/3 p-1">
                <View className="items-center rounded-md px-2 py-3 opacity-30">
                  <Text className="text-muted-foreground text-sm font-medium">
                    {month.slice(0, 3)}
                  </Text>
                </View>
              </View>
            )
          }

          return (
            <View key={month} className="w-1/3 p-1">
              <TouchableOpacity
                onPress={() => onSelect(index, year)}
                className={`items-center rounded-md px-2 py-3 ${isSelected ? "bg-accent" : ""}`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? "text-accent-foreground" : "text-foreground"
                  }`}
                >
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export function MonthPickerModal({ open, onClose, initialDate, onSelect }: MonthPickerModalProps) {
  const currentYear = new Date().getFullYear()
  const [startYear, setStartYear] = useState(() => currentYear - 1)

  const handleMonthSelect = (monthIndex: number, year: number) => {
    const selectedDate = new Date(year, monthIndex, 1)
    onSelect(selectedDate)
    onClose()
  }

  return (
    <PickerModal open={open} onClose={onClose} title="Select Month" scrollable={false}>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setStartYear((y) => y - 2)}
          className="size-10 items-center justify-center rounded-full"
        >
          <Icon as={ChevronLeftIcon} className="size-5" />
        </TouchableOpacity>
        <View className="flex-1">
          <YearSection
            year={startYear + 1}
            initialDate={initialDate}
            onSelect={handleMonthSelect}
          />
          <YearSection year={startYear} initialDate={initialDate} onSelect={handleMonthSelect} />
        </View>
        <TouchableOpacity
          onPress={() => setStartYear((y) => Math.min(y + 2, currentYear - 1))}
          disabled={startYear >= currentYear - 1}
          className={`size-10 items-center justify-center rounded-full ${
            startYear >= currentYear - 1 ? "opacity-30" : ""
          }`}
        >
          <Icon as={ChevronRightIcon} className="size-5" />
        </TouchableOpacity>
      </View>
    </PickerModal>
  )
}
