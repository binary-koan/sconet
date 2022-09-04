import { Button, Heading, Icon } from "@hope-ui/solid"
import { gql } from "@solid-primitives/graphql"
import { Title } from "@solidjs/meta"
import { Route, useSearchParams } from "@solidjs/router"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Component, createEffect, Show } from "solid-js"
import { Budgets } from "../components/budgets/Budgets"
import { BudgetsQuery, BudgetsQueryVariables } from "../graphql-types"
import { useQuery } from "../graphqlClient"

const PERIOD_KEY = "sconet.budgetPeriod"

export const BUDGETS_QUERY = gql`
  query Budgets($year: Int!, $month: Int!) {
    budget(year: $year, month: $month, currency: "JPY") {
      id
      month
      income {
        decimalAmount
        formatted
      }
      totalSpending {
        decimalAmount
        formatted
      }
      difference {
        decimalAmount
        formatted
      }
      regularCategories {
        totalSpending {
          decimalAmount
          formatted
        }
        categories {
          id
          category {
            id
            name
            color
            icon
            isRegular
            budget(currency: "JPY") {
              decimalAmount
              formatted
            }
          }
          amountSpent {
            decimalAmount
            formatted
          }
        }
      }
      irregularCategories {
        totalSpending {
          decimalAmount
          formatted
        }
        categories {
          id
          category {
            id
            name
            color
            icon
            isRegular
            budget {
              decimalAmount
              formatted
            }
          }
          amountSpent {
            decimalAmount
            formatted
          }
        }
      }
    }
  }
`

const BudgetsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const year = () => (searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear())
  const month = () =>
    searchParams.month ? parseInt(searchParams.month) : new Date().getMonth() + 1

  const [data] = useQuery<BudgetsQuery, BudgetsQueryVariables>(BUDGETS_QUERY, () => ({
    year: year(),
    month: month()
  }))

  const incrementMonth = () => {
    if (month() === 12) {
      setSearchParams({ year: year() + 1, month: 1 })
    } else {
      setSearchParams({ year: year(), month: month() + 1 })
    }
  }

  const decrementMonth = () => {
    if (month() === 1) {
      setSearchParams({ year: year() - 1, month: 12 })
    } else {
      setSearchParams({ year: year(), month: month() - 1 })
    }
  }

  createEffect(() => {
    if (year() && month()) {
      localStorage.setItem(PERIOD_KEY, JSON.stringify({ year, month }))
      return
    }

    const savedValue = localStorage.getItem(PERIOD_KEY)

    if (savedValue) {
      const { year, month } = JSON.parse(savedValue)
      setSearchParams({ year, month })
    } else {
      setSearchParams({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      })
    }
  })

  if (!year || !month) {
    return null
  }

  const date = () => new Date(year(), month() - 1, 1)

  return (
    <Show when={Boolean(data())}>
      <Title>Budgets</Title>

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$3xl" }}
        marginTop="$3"
        marginBottom="$3"
        paddingStart="$4"
        paddingEnd="$4"
        display="flex"
        alignItems="center"
        gap="$2"
      >
        {date().toLocaleDateString("en", { year: "numeric", month: "long" })}

        <Button size="sm" colorScheme="neutral" marginStart="auto" onClick={decrementMonth}>
          <Icon as={TbArrowLeft} />
        </Button>
        <Button size="sm" colorScheme="neutral" onClick={incrementMonth}>
          <Icon as={TbArrowRight} />
        </Button>
      </Heading>
      <Budgets budget={data()!.budget} year={year().toString()} month={month()} />
    </Show>
  )
}

export const BudgetsRoute: Component = () => {
  return <Route path="/budgets" component={BudgetsPage} />
}
