import { Title } from "@solidjs/meta"
import { useNavigate, useRouteData } from "@solidjs/router"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-solidjs"
import { Show } from "solid-js"
import { Cell } from "../../components/Cell.tsx"
import { GraphsNavigation } from "../../components/GraphsNavigation.tsx"
import { AnnualBalance } from "../../components/balance/AnnualBalance.tsx"
import { Button } from "../../components/base/Button.tsx"
import { PageHeader } from "../../components/base/PageHeader.tsx"
import { DefaultCurrencySelect } from "../../components/currencies/DefaultCurrencySelect.tsx"
import {
  BalanceQuery,
  BalanceQueryVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables
} from "../../graphql-types.ts"
import { QueryResource } from "../../utils/graphqlClient/useQuery.ts"

export interface BalancePageData {
  data: QueryResource<BalanceQuery, BalanceQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  year: string
}

const BalancePage = () => {
  const navigate = useNavigate()
  const routeData = useRouteData<BalancePageData>()

  return (
    <>
      <Title>Balance</Title>

      <GraphsNavigation />

      <PageHeader size="lg">
        <span class="mr-auto">Balance for {routeData.year}</span>

        <Show when={routeData.currentUser()?.currentUser}>
          <DefaultCurrencySelect
            favouriteCurrencies={routeData.currentUser()!.currentUser!.favouriteCurrencies}
            defaultCurrency={routeData.currentUser()!.currentUser!.defaultCurrency}
          />
        </Show>

        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          onClick={() => navigate(`/graphs/balance/${parseInt(routeData.year) - 1}`)}
        >
          <IconArrowLeft />
        </Button>
        <Button
          size="sm"
          colorScheme="neutral"
          variant="ghost"
          onClick={() => navigate(`/graphs/balance/${parseInt(routeData.year) + 1}`)}
          disabled={routeData.year === new Date().getFullYear().toString()}
        >
          <IconArrowRight />
        </Button>
      </PageHeader>

      <Cell data={routeData.data} success={AnnualBalance} successProps={{ year: routeData.year }} />
    </>
  )
}

export default BalancePage
