import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { TbArrowLeft, TbArrowRight } from "solid-icons/tb"
import { Resource } from "solid-js"
import { Dynamic } from "solid-js/web"
import { Button } from "../components/base/Button"
import { Heading1 } from "../components/base/Heading"
import { Budgets } from "../components/budgets/Budgets"
import { Cell } from "../components/Cell"
import { BudgetQuery } from "../graphql-types"

export interface BudgetsPageData {
  data: Resource<BudgetQuery>
  year: number
  month: number
}

const BudgetsPage = () => {
  const routeData = useRouteData<BudgetsPageData>()
  const navigate = useNavigate()

  const setParams = ({ year, month }: { year: number; month: number }) => {
    navigate(`/budgets/${year}-${month}`)
  }

  const incrementMonth = () => {
    if (routeData.month === 12) {
      setParams({ month: 1, year: routeData.year + 1 })
    } else {
      setParams({ month: routeData.month + 1, year: routeData.year })
    }
  }

  const decrementMonth = () => {
    if (routeData.month === 1) {
      setParams({ month: 12, year: routeData.year - 1 })
    } else {
      setParams({ month: routeData.month - 1, year: routeData.year })
    }
  }

  const date = () => new Date(routeData.year, routeData.month - 1, 1)

  return (
    <>
      <Title>Budgets</Title>

      <Heading1 size="lg">
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
      </Heading1>
      <Cell
        data={routeData.data}
        success={Budgets}
        successProps={{ year: routeData.year, month: routeData.month }}
      />
    </>
  )
}

export default BudgetsPage
