import { IconX } from "@tabler/icons-solidjs"
import { splitProps } from "solid-js"
import { Dynamic, Portal } from "solid-js/web"
import { AsProp, BasicElementProps } from "../../types"
import { Button, ButtonProps } from "./Button"

export const Modal = <T extends AsProp = "div">(
  allProps: BasicElementProps<T, { isOpen: boolean; onClickOutside?: () => void }>
) => {
  const [props, elementProps] = splitProps(allProps, [
    "as",
    "ref",
    "class",
    "classList",
    "children",
    "isOpen",
    "onClickOutside"
  ])

  return (
    <Portal>
      <Dynamic
        component={props.as || "div"}
        ref={props.ref}
        class={`relative transition-opacity ${
          props.isOpen ? "visible opacity-100" : "invisible opacity-0"
        } ${props.class}`}
        classList={props.classList}
        {...elementProps}
      >
        <div class="z-modal fixed inset-0 bg-gray-500/75" />

        <div class="z-modal fixed inset-0 overflow-y-auto" role="dialog">
          <div
            class="flex min-h-full items-end justify-center text-center sm:items-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) props.onClickOutside?.()
            }}
          >
            {props.children}
          </div>
        </div>
      </Dynamic>
    </Portal>
  )
}

export const ModalContent = (allProps: BasicElementProps<"div">) => {
  const [props, elementProps] = splitProps(allProps, [
    "as",
    "ref",
    "class",
    "classList",
    "children"
  ])

  return (
    <div
      ref={props.ref}
      class={`relative w-full transform rounded-t-lg bg-white p-5 pt-4 text-left shadow-xl sm:my-8 sm:max-w-lg sm:rounded-lg sm:px-6 sm:py-5 ${props.class}`}
      classList={props.classList}
      {...elementProps}
    >
      {props.children}
    </div>
  )
}

export const ModalTitle = (allProps: BasicElementProps<"div">) => {
  const [props, elementProps] = splitProps(allProps, [
    "as",
    "ref",
    "class",
    "classList",
    "children"
  ])

  return (
    <h2
      ref={props.ref}
      class={`mb-4 flex items-center text-xl font-semibold ${props.class}`}
      classList={props.classList}
      {...elementProps}
    >
      {props.children}
    </h2>
  )
}

export const ModalCloseButton = (props: ButtonProps) => (
  <Button type="button" variant="ghost" size="square" class="-mr-1 ml-auto" {...props}>
    <IconX />
  </Button>
)
