export const startOfDayUTC = (date?: Date) => {
  date = date ?? new Date()

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}
