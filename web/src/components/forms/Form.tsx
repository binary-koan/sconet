import { JSX } from "solid-js"

export const Form: <Values>(props: {
  onSave: (input: Values) => void
  children: JSX.Element
}) => JSX.Element = (props) => {
  const onSubmit = (event: SubmitEvent & { currentTarget: HTMLFormElement }) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const values: any = {}

    formData.forEach((value, name) => {
      const current = values[name]

      if (Array.isArray(current)) {
        current.push(value)
      } else if (current) {
        values[name] = [current, value]
      } else {
        values[name] = value
      }
    })

    props.onSave(values)
  }

  return <form onSubmit={onSubmit}>{props.children}</form>
}
