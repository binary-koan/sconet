import { createSignal } from "solid-js"

export type TransactionsViewPreference = "list" | "calendar"

const LOCAL_STORAGE_KEY = "sconet.transactionsViewPreference"

const [transactionsViewPreference, setSignal] = createSignal<TransactionsViewPreference>(
  (localStorage.getItem(LOCAL_STORAGE_KEY) as TransactionsViewPreference) || "list"
)

export { transactionsViewPreference }

export const setTransactionsViewPreference = (preference: TransactionsViewPreference) => {
  setSignal(preference)
  localStorage.setItem(LOCAL_STORAGE_KEY, preference)
}
