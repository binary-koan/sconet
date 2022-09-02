export const monthRange = (date: Date) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth())
  const monthEnd = new Date(monthStart)
  monthEnd.setMonth(monthEnd.getMonth() + 1)
  monthEnd.setMilliseconds(monthEnd.getMilliseconds() - 1)

  return [monthStart, monthEnd]
}
