import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { createEffect, Resource } from "solid-js"
import { Dynamic } from "solid-js/web"
import { Button } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import { Budgets } from "../components/budgets/Budgets"
import { Cell } from "../components/Cell"
import { BudgetQuery } from "../graphql-types"
import { decrementMonth, incrementMonth } from "../utils/date"
import { setLastViewedBudget } from "../utils/transactions/viewPreference"

export interface BudgetsPageData {
  data: Resource<BudgetQuery>
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

    navigate(`/budgets/${year}-${monthNumber.toString().padStart(2, "0")}`)
  }

  const date = () => new Date(parseInt(routeData.year), parseInt(routeData.month) - 1, 1)

  return (
    <>
      <Title>Budgets</Title>

      <PageHeader size="lg">
        {date().toLocaleDateString("en", { year: "numeric", month: "long" })}

        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          class="ml-auto"
          onClick={() => setParams(decrementMonth)}
        >
          <Dynamic component={TbArrowLeft} />
        </Button>
        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          onClick={() => setParams(incrementMonth)}
        >
          <Dynamic component={TbArrowRight} />
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
