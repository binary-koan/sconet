import { Component, JSX, Show, createSignal } from "solid-js"
import { AlertButtonProps, AlertModal } from "./AlertModal"
import { ButtonColor } from "./base/Button"

export interface AlertOptions {
  title: JSX.Element
  body: JSX.Element
  confirmButton?: {
    colorScheme?: ButtonColor
    content?: JSX.Element
  }
  cancelButton?: {
    enabled?: boolean
    content?: JSX.Element
  }
}

const [alert, setAlert] = createSignal<AlertOptions>()
const [onDismiss, setOnDismiss] = createSignal<(confirmed: boolean) => void>()

export const AlertManager: Component = () => {
  return (
    <Show when={alert()}>
      {(alert) => (
        <AlertModal
          isOpen={true}
          title={alert().title}
          body={alert().body}
          buttons={
            [
              alert().cancelButton?.enabled !== false && {
                colorScheme: "neutral",
                content: alert().cancelButton?.content ?? "Cancel",
                onClick: () => {
                  setAlert(undefined)
                  onDismiss()?.(false)
                  setOnDismiss(undefined)
                }
              },
              {
                colorScheme: alert().confirmButton?.colorScheme ?? "primary",
                content: alert().confirmButton?.content ?? "OK",
                onClick: () => {
                  setAlert(undefined)
                  onDismiss()?.(true)
                  setOnDismiss(undefined)
                }
              }
            ].filter(Boolean) as AlertButtonProps[]
          }
        />
      )}
    </Show>
  )
}

export function showAlert(alert: AlertOptions) {
  return new Promise<boolean>((resolve) => {
    setAlert(alert)
    setOnDismiss(() => resolve)
  })
}
