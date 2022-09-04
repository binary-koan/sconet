import { Box, Button, Text } from "@hope-ui/solid"
import { Component, createEffect, createMemo, For, Show } from "solid-js"
import { FindTransactionsQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
import { formatDate } from "../../utils/formatters"
import NewTransactionItem from "./NewTransactionItem"
import { TransactionFilterValues } from "./TransactionFilters"
import TransactionItem from "./TransactionItem"

const TransactionsList: Component<{
  transactions: FindTransactionsQuery["transactions"]["data"]
  fetchMore?: (variables: any) => void
  setFilterValues: (values: TransactionFilterValues) => void
  isEditing: boolean
}> = (props) => {
  const items = createMemo(() => {
    const firstTransactionDate = new Date(
      `${props.transactions[0].date.split("T")[0]}T00:00:00+09:00`
    )
    const lastTransactionDate = new Date(
      `${props.transactions[props.transactions.length - 1].date.split("T")[0]}T00:00:00+09:00`
    )

    const items: Array<{ date: Date; transactions: any[] }> = []

    for (
      let date = new Date(firstTransactionDate);
      date >= lastTransactionDate;
      date.setDate(date.getDate() - 1)
    ) {
      const transactionsOnDate = props.transactions.filter(
        (transaction) => formatDate(transaction.date, "fullDate") === formatDate(date, "fullDate")
      )

      items.push({ date: new Date(date), transactions: transactionsOnDate })
    }

    return items
  })

  return (
    <>
      <For each={items()}>
        {({ date, transactions }, index) => {
          const newMonth =
            index() === 0 ||
            formatDate(items()[index() - 1].date, "monthYear") !== formatDate(date, "monthYear")
          const [dateFrom, dateUntil] = monthRange(new Date(date))

          const newTransactionDate = new Date(date)
          newTransactionDate.setHours(12, 0, 0, 0)

          return (
            <>
              <Show when={newMonth}>
                <Box
                  position="sticky"
                  zIndex="docked"
                  top={{ "@initial": "0", "@lg": "$14" }}
                  marginStart={{ "@initial": "0", "@lg": "$-2" }}
                  marginEnd={{ "@initial": "0", "@lg": "$-2" }}
                  marginTop={index() === 0 ? "-2" : "6"}
                  paddingTop="$2"
                  paddingBottom="$2"
                  backgroundColor="$background"
                >
                  <Text
                    as="button"
                    onClick={() =>
                      props.setFilterValues({
                        dateFrom: dateFrom.toISOString(),
                        dateUntil: dateUntil.toISOString()
                      })
                    }
                    display="inline-block"
                    marginStart="$2"
                    marginEnd="$2"
                    paddingStart="$2"
                    paddingEnd="$2"
                    paddingTop="$1"
                    paddingBottom="$1"
                    backgroundColor="$neutral9"
                    color="white"
                    borderRadius="$md"
                    fontWeight="bold"
                    fontSize="$small"
                  >
                    {formatDate(date, "monthYear")}
                  </Text>
                </Box>
              </Show>

              <Text
                fontSize="$small"
                fontWeight="bold"
                color="gray.500"
                paddingStart="$4"
                paddingEnd="$4"
                paddingTop="$2"
                paddingBottom="$2"
              >
                {formatDate(date, "fullDateWithoutYear")}
              </Text>

              <Show when={props.isEditing}>
                <NewTransactionItem date={newTransactionDate} />
              </Show>

              <For each={transactions}>
                {(transaction) => (
                  <TransactionItem transaction={transaction} isEditing={props.isEditing} />
                )}
              </For>

              <Show when={!props.isEditing && !transactions.length}>
                <Box
                  display="flex"
                  alignItems="center"
                  paddingStart="$4"
                  paddingEnd="$4"
                  paddingBottom="$2"
                  boxShadow="$xs"
                  fontStyle="italic"
                  color="gray.500"
                >
                  -
                </Box>
              </Show>
            </>
          )
        }}
      </For>

      <Show when={props.fetchMore}>
        <Button onClick={props.fetchMore}>Fetch more</Button>
      </Show>
    </>
  )
}

export default TransactionsList
