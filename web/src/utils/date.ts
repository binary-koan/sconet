export const monthRange = (date: Date) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth())
  const monthEnd = new Date(monthStart)
  monthEnd.setMonth(monthEnd.getMonth() + 1)
  monthEnd.setMilliseconds(monthEnd.getMilliseconds() - 1)

  return [monthStart, monthEnd]
}

export const incrementMonth = ({ monthNumber, year }: { monthNumber: number; year: number }) => {
  if (monthNumber === 12) {
    return { monthNumber: 1, year: year + 1 }
  } else {
    return { monthNumber: monthNumber + 1, year: year }
  }
}

export const decrementMonth = ({ monthNumber, year }: { monthNumber: number; year: number }) => {
  if (monthNumber === 1) {
    return { monthNumber: 12, year: year - 1 }
  } else {
    return { monthNumber: monthNumber - 1, year: year }
  }
}

export const isSameDate = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

export const stripTime = (date: Date) => {
  return date.toISOString().split("T")[0]
}
