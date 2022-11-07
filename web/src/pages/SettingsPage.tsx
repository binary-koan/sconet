import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import toast from "solid-toast"
import AccountMailboxes from "../components/accountMailboxes/AccountMailboxes"
import { Button, LinkButton } from "../components/base/Button"
import { Heading1 } from "../components/base/Heading"
import CategoriesList from "../components/categories/Categories"
import { Cell } from "../components/Cell"
import { AccountMailboxesQuery, CategoriesQuery, CurrentUserQuery } from "../graphql-types"
import { setLoginToken } from "../utils/auth"

export interface SettingsPageData {
  categories: Resource<CategoriesQuery>
  accountMailboxes: Resource<AccountMailboxesQuery>
  currentUser: Resource<CurrentUserQuery>
}

const SettingsPage: Component = () => {
  const data = useRouteData<SettingsPageData>()
  // TODO:
  const toggleColorMode = () => {}

  const logOut = () => {
    setLoginToken(null)
    toast.success("Logged out.")
  }

  return (
    <>
      <Title>Settings</Title>

      <Heading1 size="lg">
        Profile
        <Button
          class="ml-auto"
          size="sm"
          variant="ghost"
          colorScheme="neutral"
          onClick={() => toggleColorMode()}
        >
          Change Theme
        </Button>
        <Button size="sm" variant="ghost" colorScheme="danger" onClick={() => logOut()}>
          Sign Out
        </Button>
      </Heading1>
      <div class="bg-white py-2 px-4 shadow-sm">{data.currentUser()?.currentUser?.email}</div>

      <Heading1 size="lg">
        Categories
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/categories/new">
          New Category
        </LinkButton>
      </Heading1>

      <Cell data={data.categories} success={CategoriesList} />

      <Heading1 size="lg">
        Accounts
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/account-mailboxes/new">
          New Account
        </LinkButton>
      </Heading1>

      <Cell data={data.accountMailboxes} success={AccountMailboxes} />
    </>
  )
}

export default SettingsPage
