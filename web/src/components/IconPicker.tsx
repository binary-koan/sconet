import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text
} from "@hope-ui/solid"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, createMemo, createSignal, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { namedIcons } from "../utils/namedIcons"

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

      <Flex alignItems="center">
        <Show when={value()}>
          <Box marginEnd="$2">
            <Dynamic component={namedIcons[value()!]} size="2em" />
          </Box>
        </Show>
        <Button onClick={[setOpen, true]}>Pick icon</Button>
      </Flex>

      <Modal opened={open()} onClose={() => setOpen(false)} size="2xl">
        <ModalOverlay />
        <ModalContent paddingBottom="$4">
          <ModalHeader>Pick Icon</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column">
            <Flex>
              <Input
                type="search"
                placeholder="Search"
                marginBottom="$4"
                onInput={(e) => setQuery(e.currentTarget.value)}
              />
              <Button
                colorScheme="neutral"
                marginStart="$2"
                disabled={!pageInfo().hasPrevious}
                onClick={[setPage, page() - 1]}
              >
                <TbArrowLeft />
              </Button>
              <Button
                colorScheme="neutral"
                marginStart="$2"
                disabled={!pageInfo().hasNext}
                onClick={[setPage, page() + 1]}
              >
                <TbArrowRight />
              </Button>
            </Flex>
            <SimpleGrid flex="1" columns={4} gap="$1">
              <For each={pageInfo().icons}>
                {([icon, component]) => (
                  <Button
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    colorScheme="neutral"
                    variant="subtle"
                    onClick={() => {
                      setValue(icon)
                      setOpen(false)
                    }}
                    height="auto"
                    padding="$1"
                  >
                    <Dynamic component={component} size="1.5em" />
                    <Text
                      noOfLines={1}
                      marginTop="$1"
                      fontSize="$2xs"
                      textAlign="center"
                      fontWeight="normal"
                      width="$full"
                    >
                      {icon}
                    </Text>
                  </Button>
                )}
              </For>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconPicker
