import { Component, createContext, createEffect, JSX, onCleanup, useContext } from "solid-js"
import { createStore, SetStoreFunction } from "solid-js/store/types"

const formContext = createContext<{
  values: { [key: string]: any }
  setValues: SetStoreFunction<{ [key: string]: any }>
}>()

export const Form: Component<{ children: JSX.Element }> = (props) => {
  const [values, setValues] = createStore({})

  createEffect(() => {})

  return (
    <formContext.Provider value={{ values, setValues }}>
      <form>{props.children}</form>
    </formContext.Provider>
  )
}

export const useInput = (
  name: string,
  options: { parseInputValue?: (value: any) => any; serializeInputValue?: (value: any) => any } = {}
) => {
  const form = useContext(formContext)

  const { parseInputValue = (value) => value, serializeInputValue = (value) => value } = options

  if (!form) {
    throw new Error("No form context")
  }

  return {
    get: () => form.values[name],
    set: (value: any) => form.setValues({ name: value }),

    get value() {
      return serializeInputValue(form.values[name])
    },
    onInput: (event: { currentTarget: { value: any } }) =>
      form.setValues({ name: parseInputValue(event.currentTarget.value) })
  }
}

export type InputConfig = ReturnType<typeof useInput>
