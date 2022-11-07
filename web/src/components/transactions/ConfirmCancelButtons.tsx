import { TbCheck, TbX } from "solid-icons/tb"
import { Component } from "solid-js"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"

const ConfirmCancelButtons: Component<{ onConfirm: () => void; onCancel: () => void }> = (
  props
) => {
  return (
    <InputAddon class="w-24">
      <Button
        size="custom"
        class="h-6 flex-1"
        colorScheme="primary"
        aria-label="Confirm"
        onClick={props.onConfirm}
      >
        <TbCheck />
      </Button>
      <Button
        size="custom"
        class="ml-1 h-6 flex-1"
        colorScheme="neutral"
        aria-label="Cancel"
        onClick={props.onCancel}
      >
        <TbX />
      </Button>
    </InputAddon>
  )
}

export default ConfirmCancelButtons
