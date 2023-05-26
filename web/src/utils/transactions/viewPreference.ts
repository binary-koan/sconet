import { createSignal } from "solid-js"

const createPreference = <PreferenceType>(name: string, defaultValue: PreferenceType) => {
  const LOCAL_STORAGE_KEY = `sconet.preferences.${name}`
  const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)

  const [value, setSignal] = createSignal<PreferenceType>(
    (storedValue && (JSON.parse(storedValue) as PreferenceType)) || defaultValue
  )

  const setValue = (value: PreferenceType) => {
    setSignal(() => value)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
  }

  return [value, setValue] as const
}

export type TransactionsViewPreference = "list" | "calendar"
export const [transactionsViewPreference, setTransactionsViewPreference] =
  createPreference<TransactionsViewPreference>("transactionsViewPreference", "list")

export type LastViewedBudget = string | null
export const [lastViewedBudget, setLastViewedBudget] = createPreference<LastViewedBudget>(
  "lastViewedBudget",
  null
)

export type LastViewedBalance = string | null
export const [lastViewedBalance, setLastViewedBalance] = createPreference<LastViewedBalance>(
  "lastViewedBalance",
  null
)
