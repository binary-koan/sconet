import { Box, Heading, Icon, IconButton, Progress, ProgressIndicator, Text } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { SolidApexCharts } from "solid-apexcharts"
import { TbArrowRight } from "solid-icons/tb"
import { Component, For } from "solid-js"
import { Dynamic } from "solid-js/web"
import { BudgetsQuery } from "../../graphql-types"
import CategoryIndicator from "../CategoryIndicator"

const getColor = (variable: string) => getComputedStyle(document.body).getPropertyValue(variable)

const BudgetGroup: Component<{
  title: string
  group: BudgetsQuery["budget"]["regularCategories"]
  filteredTransactionsRoute: (filters?: any) => string
}> = (props) => {
  return (
    <Box display="flex" flexDirection={{ "@initial": "column", "@lg": "row-reverse" }}>
      <Box
        width="full"
        height="100vw"
        maxWidth="30rem"
        maxHeight="30rem"
        margin={{ "@initial": "0 auto", "@lg": "0" }}
      >
        <SolidApexCharts
          width="500"
          type="pie"
          options={{
            labels: props.group.categories.map(({ category }) => category?.name || "Uncategorized"),
            tooltip: { enabled: false },
            dataLabels: {
              dropShadow: { enabled: false }
            },
            fill: {
              colors: props.group.categories.map(({ category }) =>
                category?.color
                  ? getColor(`--hope-colors-${category.color}`)
                  : getColor("--hope-colors-neutral8")
              )
            },
            legend: {
              markers: {
                fillColors: props.group.categories.map(({ category }) =>
                  category?.color
                    ? getColor(`--hope-colors-${category.color}`)
                    : getColor("--hope-colors-neutral8")
                )
              }
            }
          }}
          series={props.group.categories.map(({ amountSpent }) => amountSpent.decimalAmount)}
        />
      </Box>
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
            icon={<Dynamic component={TbArrowRight} />}
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
                  icon={<Dynamic component={TbArrowRight} />}
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
