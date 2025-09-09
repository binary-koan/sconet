import { Component, For, JSX } from "solid-js"
import { Button, ButtonColor } from "./base/Button.tsx"
import { Modal, ModalContent, ModalTitle } from "./base/Modal.tsx"

export interface AlertButtonProps {
  colorScheme: ButtonColor
  content: JSX.Element
  onClick: () => void
}

export const AlertModal: Component<{
  isOpen: boolean
  title: JSX.Element
  body: JSX.Element
  buttons: Array<AlertButtonProps>
}> = (props) => {
  return (
    <Modal isOpen={props.isOpen}>
      <ModalContent>
        <ModalTitle>{props.title}</ModalTitle>
        <div class="mb-6">{props.body}</div>

        <div class="flex justify-end gap-2">
          <For each={props.buttons}>
            {(button) => (
              <Button colorScheme={button.colorScheme} onClick={button.onClick}>
                {button.content}
              </Button>
            )}
          </For>
        </div>
      </ModalContent>
    </Modal>
  )
}
