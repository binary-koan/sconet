import { InputRightElement, IconButton, Icon } from "@hope-ui/solid"
import { TbCheck, TbCross } from "solid-icons/tb"
import { Component } from "solid-js"

const ConfirmCancelButtons: Component<{ onConfirm: () => void; onCancel: () => void }> = (
  props
) => {
  return (
    <InputRightElement width="$24" paddingEnd="$2">
      <IconButton
        size="sm"
        flex="1"
        height="$6"
        colorScheme="primary"
        icon={<Icon as={TbCheck} />}
        aria-label="Confirm"
        onClick={props.onConfirm}
      />
      <IconButton
        size="sm"
        flex="1"
        height="$6"
        marginStart="$1"
        colorScheme="neutral"
        icon={<Icon as={TbCross} />}
        aria-label="Cancel"
        onClick={props.onCancel}
      />
    </InputRightElement>
  )
}

export default ConfirmCancelButtons
