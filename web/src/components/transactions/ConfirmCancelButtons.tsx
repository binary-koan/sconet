import { IconCheck, IconX } from "@tabler/icons-solidjs"
import { Component } from "solid-js"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"

const ConfirmCancelButtons: Component<{ onConfirm: () => void; onCancel: () => void }> = (
  props
) => {
  return (
    <InputAddon class="flex w-24">
      <Button
        class="ml-1 flex-1"
        colorScheme="primary"
        aria-label="Confirm"
        onClick={props.onConfirm}
      >
        <IconCheck />
      </Button>
      <Button
        class="ml-1 flex-1"
        colorScheme="neutral"
        aria-label="Cancel"
        onClick={props.onCancel}
      >
        <IconX />
      </Button>
    </InputAddon>
  )
}

export default ConfirmCancelButtons
