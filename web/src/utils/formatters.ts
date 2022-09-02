const dateFormats = {
  fullDate: new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  }),
  fullDateWithoutYear: new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    day: "numeric",
    month: "short"
  }),
  monthYear: new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    month: "long",
    year: "numeric"
  })
}

export type DateFormat = keyof typeof dateFormats

export const formatDate = (datetime: Date | string, format: DateFormat) => {
  return dateFormats[format].format(new Date(datetime))
}

const currencyFormat = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "JPY"
})

export const formatCurrency = (amount: number) => {
  return currencyFormat.format(amount)
}

export const formatDateTimeForInput = (value?: Date | string) => {
  if (!value) return

  const date = new Date(value)

  return [
    date.getFullYear(),
    "-",
    (date.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    date.getDate().toString().padStart(2, "0"),
    "T",
    date.getHours().toString().padStart(2, "0"),
    ":",
    date.getMinutes().toString().padStart(2, "0")
  ].join("")
}
