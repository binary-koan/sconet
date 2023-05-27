export const buildMonthDates = (year: number, monthNumber: number) => {
  const monthStart = new Date(Date.UTC(year, monthNumber - 1, 1))
  const monthEnd = new Date(Date.UTC(year, monthNumber, 0))

  const lastDate = new Date(monthEnd)

  const date = new Date(monthStart)
  date.setDate(date.getDate() - daysBeforeToShow(monthStart.getDay()))

  const dates: Array<{
    date: Date
    isCurrentMonth: boolean
  }> = []

  while (date.getTime() <= lastDate.getTime()) {
    dates.push({
      date: new Date(date),
      isCurrentMonth: date.getMonth() === monthNumber - 1
    })

    date.setDate(date.getDate() + 1)
  }

  while (dates.length < 6 * 7) {
    dates.push({
      date: new Date(date),
      isCurrentMonth: false
    })

    date.setDate(date.getDate() + 1)
  }

  return dates
}

const daysBeforeToShow = (dayOfWeek: number) => {
  if (dayOfWeek === 0) {
    return 6
  } else if (dayOfWeek === 1) {
    return 7
  } else {
    return dayOfWeek - 1
  }
}
