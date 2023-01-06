import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, createMemo, createSignal, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { namedIcons } from "../utils/namedIcons"
import { Button } from "./base/Button"
import { Input } from "./base/Input"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "./base/Modal"

const PAGE_SIZE = 40

const IconPicker: Component<{ name: string; defaultValue?: string }> = (props) => {
  const [open, setOpen] = createSignal(false)
  const [query, setQuery] = createSignal("")
  const [value, setValue] = createSignal(props.defaultValue)
  const [page, setPage] = createSignal(0)

  const icons = createMemo(() =>
    Object.entries(namedIcons).filter(([name]) =>
      name.toLowerCase().includes(query().toLowerCase())
    )
  )

  const pageInfo = createMemo(() => {
    const totalPages = icons().length / PAGE_SIZE

    return {
      hasPrevious: page() > 0,
      hasNext: page() < totalPages - 1,
      icons: icons().slice(page() * PAGE_SIZE, (page() + 1) * PAGE_SIZE)
    }
  })

  return (
    <>
      <input name={props.name} value={value()} style={{ display: "none" }} />

      <div class="flex items-center">
        <Show when={value()}>
          <div class="mr-2">
            <Dynamic component={namedIcons[value()!]} size="2em" />
          </div>
        </Show>
        <Button onClick={[setOpen, true]}>Pick icon</Button>
      </div>

      <Modal isOpen={open()} onClickOutside={() => setOpen(false)}>
        <ModalContent>
          <ModalTitle>
            Pick Icon <ModalCloseButton onClick={() => setOpen(false)} />
          </ModalTitle>
          <div class="flex flex-col">
            <div class="flex">
              <Input
                class="mb-4 w-full"
                type="search"
                placeholder="Search"
                onInput={(e) => setQuery(e.currentTarget.value)}
              />
              <Button
                class="ml-2"
                disabled={!pageInfo().hasPrevious}
                onClick={[setPage, page() - 1]}
              >
                <TbArrowLeft />
              </Button>
              <Button class="ml-2" disabled={!pageInfo().hasNext} onClick={[setPage, page() + 1]}>
                <TbArrowRight />
              </Button>
            </div>
            <div class="grid flex-1 grid-cols-4 gap-1">
              <For each={pageInfo().icons}>
                {([icon, component]) => (
                  <Button
                    colorScheme={value() === icon ? "primary" : "neutral"}
                    class="flex-col"
                    size="xs"
                    onClick={() => {
                      setValue(icon)
                      setOpen(false)
                    }}
                  >
                    <Dynamic component={component} size="1.5em" />
                    <span class="text-2xs mt-1 w-full truncate text-center font-normal">
                      {icon}
                    </span>
                  </Button>
                )}
              </For>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconPicker
