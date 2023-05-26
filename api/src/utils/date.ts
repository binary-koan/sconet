export const startOfDayUTC = (date?: Date) => {
  date = date ?? new Date()

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export const stripTime = (date: Date) => {
  return date.toISOString().split(`T`)[0]
}

export const oneDayFromNow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}
