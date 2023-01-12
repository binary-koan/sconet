import { createSignal } from "solid-js"

const createSetting = (key: string) => {
  const [value, setSignal] = createSignal(localStorage.getItem(key))

  function setValue(value: string | null) {
    if (value) {
      setSignal(value)
      localStorage.setItem(key, value)
    } else {
      setSignal(null)
      localStorage.removeItem(key)
    }
  }

  return [value, setValue] as const
}

const [preferredCurrency, setPreferredCurrency] = createSetting("sconet.preferredCurrency")
const [preferredAccount, setPreferredAccount] = createSetting("sconet.preferredAccount")

export { preferredCurrency, setPreferredCurrency, preferredAccount, setPreferredAccount }
