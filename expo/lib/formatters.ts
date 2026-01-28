const dateFormats = {
  fullDate: new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
  fullDateWithoutYear: new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }),
  monthYear: new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }),
}

export type DateFormat = keyof typeof dateFormats

export const formatDate = (datetime: Date | string, format: DateFormat) => {
  return dateFormats[format].format(new Date(datetime))
}

export const stripTime = (date: Date): string => {
  return date.toISOString().split("T")[0]
}
