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

  const setParams = ({ year, month }: { year: string | number; month: string | number }) => {
    navigate(`/budgets/${year}-${month.toString().padStart(2, "0")}`)
  }

  const incrementMonth = () => {
    if (routeData.month === "12") {
      setParams({ month: 1, year: parseInt(routeData.year) + 1 })
    } else {
      setParams({ month: parseInt(routeData.month) + 1, year: routeData.year })
    }
  }

  const decrementMonth = () => {
    if (routeData.month === "1") {
      setParams({ month: 12, year: parseInt(routeData.year) - 1 })
    } else {
      setParams({ month: parseInt(routeData.month) - 1, year: routeData.year })
    }
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
          onClick={decrementMonth}
        >
          <Dynamic component={TbArrowLeft} />
        </Button>
        <Button size="sm" colorScheme="neutral" variant="ghost" onClick={incrementMonth}>
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
