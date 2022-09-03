import { Box, Icon, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { TbEdit } from "solid-icons/tb"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { formatCurrency } from "../../utils/formatters"
import MemoEditor from "./MemoEditor"
import RelationEditor from "./RelationEditor"

const TransactionItem: Component<{ transaction: any; parent?: any; isEditing: boolean }> = (
  props
) => {
  const [editingMemo, setEditingMemo] = createSignal(false)

  const stopEditing = () => setEditingMemo(false)

  createEffect(() => {
    if (!props.isEditing) setEditingMemo(false)
  })

  const includeInReports = () =>
    Boolean(
      props.transaction.includeInReports ||
        props.transaction.splitTo?.some((child: any) => child.includeInReports)
    )

  return (
    <>
      <Dynamic
        component={props.isEditing ? "a" : Link}
        href={`/transactions/${props.transaction.id}`}
        onClick={(event) => {
          if (props.isEditing) {
            event.stopPropagation()
            event.preventDefault()
          }
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          paddingStart={props.parent ? "$10" : "$4"}
          paddingEnd="$4"
          paddingTop="$2"
          paddingBottom="$2"
          backgroundColor="$neutral1"
          boxShadow="xs"
        >
          <RelationEditor
            parent={props.parent}
            transaction={props.transaction}
            includeInReports={includeInReports()}
            isEditing={props.isEditing}
          />

          <Box marginLeft="$4" flex="1" minWidth="0">
            {editingMemo() ? (
              <MemoEditor transaction={props.transaction} stopEditing={stopEditing} />
            ) : (
              <>
                <Text
                  noOfLines={1}
                  lineHeight="1"
                  color={includeInReports() ? "inherit" : "$neutral6"}
                  textDecoration={includeInReports() ? "none" : "line-through"}
                  onClick={() => props.isEditing && setEditingMemo(true)}
                >
                  {props.transaction.memo}
                  <Show when={props.isEditing && includeInReports()}>
                    <EditableIndicator />
                  </Show>
                </Text>
                <Show when={!parent && !props.isEditing}>
                  <Text
                    noOfLines={1}
                    paddingTop="1"
                    lineHeight="1"
                    fontSize="$xs"
                    color={includeInReports() ? "$neutral6" : "$neutral3"}
                    textTransform="uppercase"
                  >
                    {props.transaction.accountMailbox?.name} / {props.transaction.originalMemo}
                  </Text>
                </Show>
              </>
            )}
          </Box>
          <Text
            color={includeInReports() ? "inherit" : "gray.400"}
            textDecoration={includeInReports() ? "none" : "line-through"}
            marginStart="$2"
            css={{ whiteSpace: "nowrap" }}
          >
            {formatCurrency(props.transaction.amount)}
          </Text>
          {/* {props.isEditing && !parent && <SplitTransactionButton transaction={props.transaction} />}
          {props.isEditing && <VisibilityEditor transaction={props.transaction} />}
          {props.isEditing && <DeleteTransactionButton transaction={props.transaction} />} */}
        </Box>
      </Dynamic>
      <For each={props.transaction.splitTo}>
        {(child: any) => (
          <TransactionItem
            transaction={child}
            parent={props.transaction}
            isEditing={props.isEditing}
          />
        )}
      </For>
    </>
  )
}

const EditableIndicator = () => (
  <Icon as={TbEdit} color="$neutral8" marginStart="1" position="relative" bottom="-2px" />
)

export default TransactionItem
