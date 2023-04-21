import { TbX } from "solid-icons/tb"
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
        class={`z-modal relative transition-opacity ${
          props.isOpen ? "visible opacity-100" : "invisible opacity-0"
        } ${props.class}`}
        classList={props.classList}
        {...elementProps}
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div class="z-modal fixed inset-0 overflow-y-auto">
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

export const ModalContent = <T extends AsProp = "div">(allProps: BasicElementProps<T>) => {
  const [props, elementProps] = splitProps(allProps, [
    "as",
    "ref",
    "class",
    "classList",
    "children"
  ])

  return (
    <Dynamic
      component={props.as || "div"}
      ref={props.ref}
      class={`relative w-full transform rounded-t-lg bg-white p-5 pt-4 text-left shadow-xl sm:my-8 sm:max-w-lg sm:rounded-lg sm:py-5 sm:px-6 ${props.class}`}
      classList={props.classList}
      {...elementProps}
    >
      {props.children}
    </Dynamic>
  )
}

export const ModalTitle = <T extends AsProp = "div">(allProps: BasicElementProps<T>) => {
  const [props, elementProps] = splitProps(allProps, [
    "as",
    "ref",
    "class",
    "classList",
    "children"
  ])

  return (
    <h2
      component={props.as || "div"}
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
  <Button type="button" variant="ghost" size="square" class="ml-auto -mr-1" {...props}>
    <TbX />
  </Button>
)
