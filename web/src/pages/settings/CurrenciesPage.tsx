import { useRouteData } from "@solidjs/router"
import { Component } from "solid-js"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { CurrenciesList } from "../../components/currencies/Currencies"
import {
  CurrenciesQuery,
  CurrenciesQueryVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables
} from "../../graphql-types"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface CurrenciesPageData {
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  currencies: QueryResource<CurrenciesQuery, CurrenciesQueryVariables>
}

const SettingsPage: Component = () => {
  const data = useRouteData<CurrenciesPageData>()

  return (
    <InnerPageWrapper heading="Currencies" backLink="/settings" contentBackground={false}>
      <Cell
        data={data.currencies}
        success={CurrenciesList}
        successProps={{ currentUser: data.currentUser() }}
      />
    </InnerPageWrapper>
  )
}

export default SettingsPage
