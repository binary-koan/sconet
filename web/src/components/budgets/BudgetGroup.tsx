import { Box, Heading, IconButton, Progress, ProgressIndicator, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { TbListSearch } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { Dynamic } from "solid-js/web"
import { BudgetsQuery } from "../../graphql-types"
import { getCssValue } from "../../utils/getCssValue"
import CategoryIndicator from "../CategoryIndicator"
import { PieChart } from "./PieChart"

const BudgetGroup: Component<{
  title: string
  group: BudgetsQuery["budget"]["regularCategories"]
  filteredTransactionsRoute: (filters?: any) => string
}> = (props) => {
  return (
    <Box display="flex" flexDirection={{ "@initial": "column", "@lg": "row-reverse" }}>
      <PieChart
        data={props.group.categories.map(({ category, amountSpent }) => ({
          name: category?.name || "Uncategorized",
          color: category?.color
            ? getCssValue(`--hope-colors-${category.color}`)
            : getCssValue("--hope-colors-neutral8"),
          value: amountSpent.decimalAmount,
          formattedValue: amountSpent.formatted
        }))}
      />
      <Box flex={{ "@initial": "0", "@lg": "1" }}>
        <Heading
          size="sm"
          marginBottom="$4"
          paddingStart="$4"
          paddingEnd="$4"
          display="flex"
          alignItems="center"
        >
          {props.title}
          <Text as="span" marginLeft="auto" fontSize="md">
            {props.group.totalSpending.formatted}
          </Text>
          <IconButton
            as={Link}
            href={props.filteredTransactionsRoute({
              categoryIds: props.group.categories.map((category) => category?.id || null)
            })}
            size="sm"
            variant="ghost"
            icon={<Dynamic component={TbListSearch} />}
            marginStart="$4"
            aria-label="View transactions"
          />
        </Heading>
        <Box
          backgroundColor="$neutral1"
          boxShadow="$xs"
          paddingTop="$6"
          paddingStart="$4"
          paddingEnd="$4"
          marginBottom="$6"
          marginStart={{ "@initial": "0", "@lg": "$4" }}
        >
          <For each={props.group.categories}>
            {({ category, amountSpent }) => (
              <Box paddingBottom="$6" display="flex" alignItems="center">
                <CategoryIndicator
                  size="8"
                  marginEnd="$3"
                  color={category?.color}
                  icon={category?.icon as any}
                  alignSelf="flex-start"
                />
                <Box flex="1" minWidth="0">
                  <Box display="flex" marginTop="$1">
                    <Text noOfLines={1}>{category?.name || "Uncategorized"}</Text>
                    <Box marginLeft="auto" paddingLeft="$2">
                      {amountSpent.formatted}
                    </Box>
                  </Box>
                  <Progress
                    size="xs"
                    value={
                      category?.budget
                        ? (amountSpent.decimalAmount / category.budget.decimalAmount) * 100
                        : 0
                    }
                  >
                    <ProgressIndicator
                      color={category?.color ? `$${category.color}` : "$neutral8"}
                    />
                  </Progress>
                  <Box display="flex">
                    {category?.budget ? (
                      <>
                        <Text
                          fontSize="$xs"
                          color={
                            amountSpent.decimalAmount > category.budget.decimalAmount
                              ? "$danger9"
                              : "$neutral9"
                          }
                          fontWeight={
                            amountSpent.decimalAmount > category.budget.decimalAmount
                              ? "bold"
                              : "normal"
                          }
                        >
                          {(
                            (amountSpent.decimalAmount / category.budget.decimalAmount) *
                            100
                          ).toFixed(0)}
                          % spent
                        </Text>
                        <Text fontSize="xs" marginLeft="auto" color="gray.400">
                          {category.budget.formatted} budget
                        </Text>
                      </>
                    ) : (
                      <Text fontSize="xs" color="gray.400" marginLeft="auto">
                        No budget
                      </Text>
                    )}
                  </Box>
                </Box>
                <IconButton
                  as={Link}
                  href={props.filteredTransactionsRoute({
                    categoryIds: [category?.id || null]
                  })}
                  size="sm"
                  variant="ghost"
                  icon={<Dynamic component={TbListSearch} />}
                  marginStart="$4"
                  aria-label="View transactions"
                />
              </Box>
            )}
          </For>
        </Box>
      </Box>
    </Box>
  )
}

export default BudgetGroup
