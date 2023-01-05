export const buildMonthDates = (year: number, monthNumber: number) => {
  const monthStart = new Date(year, monthNumber - 1, 1)
  const monthEnd = new Date(year, monthNumber, 0)

  const lastDate = new Date(monthEnd)
  lastDate.setDate(lastDate.getDate() + daysAfterToShow(monthEnd.getDay()))

  let date = new Date(monthStart)
  date.setDate(date.getDate() - daysBeforeToShow(monthStart.getDay()))

  let dates: Array<{
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

const daysAfterToShow = (dayOfWeek: number) => {
  return 7 - dayOfWeek
}
