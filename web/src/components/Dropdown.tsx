import {
  children,
  Component,
  createEffect,
  createSignal,
  JSX,
  mergeProps,
  onCleanup,
  Show,
  splitProps
} from "solid-js"

export type DropdownPlacement = "bottomLeft" | "bottomRight"

const placementClasses: { [key in DropdownPlacement]: string } = {
  bottomLeft: "left-0",
  bottomRight: "right-0"
}

export const Dropdown: Component<{
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  children: JSX.Element
  content: JSX.Element
  placement?: DropdownPlacement
}> = (props) => {
  props = mergeProps({ placement: "bottomLeft" } as const, props)

  const [internalIsOpen, setInternalIsOpen] = createSignal(false)

  const setOpen = (setter: (current: boolean | undefined) => boolean) => {
    if (props.onToggle) {
      props.onToggle(setter(props.isOpen))
    } else {
      setInternalIsOpen(setter)
    }
  }

  const isOpen = () => internalIsOpen() || props.isOpen

  const toggle = children(() => props.children)

  createEffect(() => {
    const listener = () => {
      setOpen((isOpen) => !isOpen)
    }

    const elements = toggle.toArray()

    elements.forEach((element) => {
      if (element instanceof Node) {
        element.addEventListener("click", listener)
      }
    })

    onCleanup(() =>
      elements.forEach((element) => {
        if (element instanceof Node) {
          element.removeEventListener("click", listener)
        }
      })
    )
  })

  let container: HTMLDivElement | undefined

  createEffect(() => {
    if (!isOpen()) return

    const documentListener = (event: MouseEvent) => {
      if (!container?.contains(event.target as Node)) {
        setOpen(() => false)
      }
    }

    document.body.addEventListener("click", documentListener)

    onCleanup(() => document.body.removeEventListener("click", documentListener))
  })

  return (
    <div class="relative" ref={container}>
      {toggle()}
      <Show when={isOpen()}>
        <div
          class={`absolute mt-1 overflow-hidden whitespace-nowrap rounded border border-gray-100 bg-white shadow-lg ${
            placementClasses[props.placement!]
          }`}
        >
          {props.content}
        </div>
      </Show>
    </div>
  )
}

export const DropdownMenuItem: Component<JSX.IntrinsicElements["button"]> = (allProps) => {
  const [props, buttonProps] = splitProps(allProps, ["class", "children"])

  return (
    <button
      class={`flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 ${
        props.class || ""
      }`}
      {...buttonProps}
    >
      {props.children}
    </button>
  )
}
