import { Box, Button, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { Component, Show } from "solid-js"
import { BudgetsQuery } from "../../graphql-types"

export const BudgetSummary: Component<{
  budget: BudgetsQuery["budget"]
  year: number
  month: number
  isPastMonth: boolean
  filteredTransactions: () => string
}> = (props) => {
  return (
    <Box
      paddingStart="$4"
      paddingEnd="$4"
      paddingBottom={{ "@initial": "0", "@lg": "$6" }}
      display="flex"
      alignItems="center"
    >
      <Button
        as={Link}
        colorScheme="neutral"
        variant="subtle"
        href={props.filteredTransactions()}
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="auto"
        padding="$2"
        marginEnd="$2"
      >
        <Text fontSize={{ "@initial": "$sm", "@lg": "$lg" }} marginBottom="$1">
          {props.budget.income.formatted}
        </Text>
        <Text fontSize="$xs" noOfLines={1}>
          Income
        </Text>
      </Button>

      <Show when={props.isPastMonth}>
        <Text fontSize="$2xl">-</Text>
      </Show>

      <Button
        as={Link}
        colorScheme="neutral"
        variant="subtle"
        href={props.filteredTransactions()}
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="auto"
        padding="$2"
        marginStart="$2"
      >
        <Text fontSize={{ "@initial": "$sm", "@lg": "$lg" }} marginBottom="$1">
          {props.budget.totalSpending.formatted}
        </Text>
        <Text fontSize="$xs" noOfLines={1}>
          Spending
        </Text>
      </Button>

      <Show when={props.isPastMonth}>
        <Text fontSize="$2xl" marginStart="$2">
          =
        </Text>

        <Button
          as={Link}
          colorScheme="neutral"
          variant="subtle"
          href={props.filteredTransactions()}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="auto"
          padding="$2"
          marginStart="$2"
        >
          <Text
            fontSize={{ "@initial": "$sm", "@lg": "$lg" }}
            marginBottom="$1"
            color={props.budget.difference.decimalAmount < 0 ? "$danger9" : "$success9"}
          >
            {props.budget.difference.formatted}
          </Text>
          <Text fontSize="$xs" noOfLines={1}>
            Balance
          </Text>
        </Button>
      </Show>
    </Box>
  )
}
