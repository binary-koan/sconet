import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbArrowLeft, TbArrowRight, TbCalendarEvent } from "solid-icons/tb"
import { Show, createEffect } from "solid-js"
import { Cell } from "../../components/Cell"
import { GraphsNavigation } from "../../components/GraphsNavigation"
import { MonthPickerOverlay } from "../../components/MonthPickerOverlay"
import { Button } from "../../components/base/Button"
import { PageHeader } from "../../components/base/PageHeader"
import { Budgets } from "../../components/budgets/Budgets"
import { DefaultCurrencySelect } from "../../components/currencies/DefaultCurrencySelect"
import {
  BudgetQuery,
  BudgetQueryVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables
} from "../../graphql-types"
import { decrementMonth, incrementMonth } from "../../utils/date"
import { QueryResource } from "../../utils/graphqlClient/useQuery"
import { setLastViewedBudget } from "../../utils/transactions/viewPreference"

export interface BudgetsPageData {
  data: QueryResource<BudgetQuery, BudgetQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  year: string
  month: string
}

const BudgetsPage = () => {
  const routeData = useRouteData<BudgetsPageData>()
  const navigate = useNavigate()

  createEffect(() => setLastViewedBudget(`${routeData.year}-${routeData.month}`))

  const setParams = (
    setter: (options: { year: number; monthNumber: number }) => {
      year: number
      monthNumber: number
    }
  ) => {
    const { year, monthNumber } = setter({
      year: parseInt(routeData.year),
      monthNumber: parseInt(routeData.month)
    })

    navigate(`/graphs/budgets/${year}-${monthNumber.toString().padStart(2, "0")}`)
  }

  const date = () => new Date(parseInt(routeData.year), parseInt(routeData.month) - 1, 1)

  const isCurrentMonth = () => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return date().getTime() === thisMonthStart.getTime()
  }

  return (
    <>
      <Title>Budgets</Title>

      <GraphsNavigation />

      <PageHeader size="lg">
        <MonthPickerOverlay
          class="mr-auto flex items-center gap-1"
          value={`${routeData.year}-${routeData.month}`}
          disableFutureDates
          onChange={(value) => navigate(`/graphs/budgets/${value}`)}
        >
          {date().toLocaleDateString("en", { year: "numeric", month: "long" })}
          <TbCalendarEvent />
        </MonthPickerOverlay>

        <Show when={routeData.currentUser()?.currentUser}>
          <DefaultCurrencySelect
            favoriteCurrencies={routeData.currentUser()!.currentUser!.favoriteCurrencies}
            defaultCurrency={routeData.currentUser()!.currentUser!.defaultCurrency}
          />
        </Show>

        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          onClick={() => setParams(decrementMonth)}
        >
          <TbArrowLeft />
        </Button>
        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          onClick={() => setParams(incrementMonth)}
          disabled={isCurrentMonth()}
        >
          <TbArrowRight />
        </Button>
      </PageHeader>
      <Cell
        data={routeData.data}
        success={Budgets}
        successProps={{ year: routeData.year, month: routeData.month }}
      />
    </>
  )
}

export default BudgetsPage
