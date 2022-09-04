import { Box, Button, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { Component, Show } from "solid-js"
import { BudgetsQuery } from "../../graphql-types"
import { monthRange } from "../../utils/date"
import BudgetGroup from "./BudgetGroup"

export const Budgets: Component<{
  budget: BudgetsQuery["budget"]
  year: string
  month: number
}> = (props) => {
  const range = () => monthRange(new Date(parseInt(props.year), props.month - 1))

  const isPastMonth = () => new Date() > range()[1]

  const filteredTransactions = (filters: any = {}) => {
    const searchParams = new URLSearchParams()
    searchParams.set(
      "filters",
      JSON.stringify({
        dateFrom: range()[0].toISOString(),
        dateUntil: range()[1].toISOString(),
        ...filters
      })
    )

    return `/transactions?${searchParams.toString()}`
  }

  return (
    <>
      <Box paddingStart="$4" paddingEnd="$4" paddingBottom="$6" display="flex" alignItems="center">
        <Button
          as={Link}
          href={filteredTransactions()}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="auto"
          paddingTop="$2"
          paddingBottom="$2"
          marginEnd="$2"
          marginStart="$2"
        >
          <Text fontSize="$lg" marginBottom="$1">
            {props.budget.income.formatted}
          </Text>
          <Text fontSize="$xs" noOfLines={1}>
            Income
          </Text>
        </Button>

        <Show when={isPastMonth()}>
          <Text fontSize="4xl">-</Text>
        </Show>

        <Button
          as={Link}
          href={filteredTransactions()}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="auto"
          paddingTop="$2"
          paddingBottom="$2"
          marginStart="$2"
          marginEnd="$2"
        >
          <Text fontSize="$lg" marginBottom="$1">
            {props.budget.totalSpending.formatted}
          </Text>
          <Text fontSize="$xs" noOfLines={1}>
            Spending
          </Text>
        </Button>

        <Show when={isPastMonth()}>
          <Text fontSize="$4xl" marginStart="$2" marginEnd="$2">
            =
          </Text>

          <Button
            as={Link}
            href={filteredTransactions()}
            flex="1"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="auto"
            paddingTop="$2"
            paddingBottom="$2"
          >
            <Text
              fontSize="lg"
              marginBottom="$1"
              color={props.budget.difference.decimalAmount < 0 ? "$danger9" : "$success9"}
            >
              {props.budget.difference.formatted}
            </Text>
            <Text fontSize="xs" noOfLines={1}>
              Balance
            </Text>
          </Button>
        </Show>
      </Box>

      <BudgetGroup
        title="Regular spending"
        group={props.budget.regularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
      <BudgetGroup
        title="Contingent spending"
        group={props.budget.irregularCategories}
        filteredTransactionsRoute={filteredTransactions}
      />
    </>
  )
}
