import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import { Component } from "solid-js"
import toast from "solid-toast"
import AccountMailboxes from "../components/accountMailboxes/AccountMailboxes"
import { Button, LinkButton } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import CategoriesList from "../components/categories/Categories"
import { Cell } from "../components/Cell"
import Currencies from "../components/currencies/Currencies"
import { CurrentExchangeRates } from "../components/exchangeRates/CurrentExchangeRates"
import {
  AccountMailboxesQuery,
  AccountMailboxesQueryVariables,
  CategoriesQuery,
  CategoriesQueryVariables,
  CurrenciesQuery,
  CurrenciesQueryVariables,
  CurrentExchangeRatesQuery,
  CurrentExchangeRatesQueryVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables
} from "../graphql-types"
import { setLoginToken } from "../utils/auth"
import { QueryResource } from "../utils/graphqlClient/useQuery"

export interface SettingsPageData {
  categories: QueryResource<CategoriesQuery, CategoriesQueryVariables>
  accountMailboxes: QueryResource<AccountMailboxesQuery, AccountMailboxesQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  currencies: QueryResource<CurrenciesQuery, CurrenciesQueryVariables>
  currentExchangeRates: QueryResource<CurrentExchangeRatesQuery, CurrentExchangeRatesQueryVariables>
}

const SettingsPage: Component = () => {
  const data = useRouteData<SettingsPageData>()

  const logOut = () => {
    setLoginToken(null)
    toast.success("Logged out.")
  }

  return (
    <>
      <Title>Settings</Title>

      <PageHeader size="lg">
        Profile
        <Button
          class="ml-auto"
          size="sm"
          variant="ghost"
          colorScheme="danger"
          onClick={() => logOut()}
        >
          Sign Out
        </Button>
      </PageHeader>
      <div class="bg-white py-2 px-4 shadow-sm">{data.currentUser()?.currentUser?.email}</div>

      <PageHeader size="lg">
        Categories
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/categories/new">
          New Category
        </LinkButton>
      </PageHeader>

      <Cell data={data.categories} success={CategoriesList} />

      <PageHeader size="lg">
        Accounts
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/account-mailboxes/new">
          New Account
        </LinkButton>
      </PageHeader>

      <Cell data={data.accountMailboxes} success={AccountMailboxes} />

      <PageHeader size="lg">Currencies</PageHeader>

      <Cell data={data.currencies} success={Currencies} />

      <PageHeader size="lg">Current Exchange Rates</PageHeader>

      <Cell data={data.currentExchangeRates} success={CurrentExchangeRates} />
    </>
  )
}

export default SettingsPage
