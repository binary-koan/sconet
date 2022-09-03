export function serializeDate(date?: Date | null) {
  if (date) {
    return Math.floor(date.getTime() / 1000)
  }

  return null
}

export function loadDate(value: number): Date
export function loadDate(value: null): null
export function loadDate(value: undefined): null
export function loadDate(value?: number | null) {
  if (value != null) {
    return new Date(value * 1000)
  }

  return null
}
