import { useColorMode, Heading, Button, Text } from "@hope-ui/solid"
import { Title } from "@solidjs/meta"
import { Link, useRouteData } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import toast from "solid-toast"
import AccountMailboxes from "../components/accountMailboxes/AccountMailboxes"
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
  const { toggleColorMode } = useColorMode()

  const logOut = () => {
    setLoginToken(null)
    toast.success("Logged out.")
  }

  return (
    <>
      <Title>Settings</Title>

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        marginTop="$4"
        marginBottom="$4"
        paddingStart="$4"
        paddingEnd="$4"
        display="flex"
        alignItems="center"
      >
        Profile
        <Button
          marginStart="auto"
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
      </Heading>
      <Text
        boxShadow="$xs"
        paddingTop="$2"
        paddingBottom="$2"
        paddingStart="$4"
        paddingEnd="$4"
        background="$neutral1"
      >
        {data.currentUser()?.currentUser?.email}
      </Text>

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        marginTop="$8"
        marginBottom="$4"
        paddingStart="$4"
        paddingEnd="$4"
        display="flex"
        alignItems="center"
      >
        Categories
        <Button marginStart="auto" size="sm" colorScheme="primary" as={Link} href="/categories/new">
          New Category
        </Button>
      </Heading>

      <Cell data={data.categories} success={CategoriesList} />

      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        marginTop="$8"
        marginBottom="$4"
        paddingStart="$4"
        paddingEnd="$4"
        display="flex"
        alignItems="center"
      >
        Accounts
        <Button
          marginStart="auto"
          size="sm"
          colorScheme="primary"
          as={Link}
          href="/account-mailboxes/new"
        >
          New Account
        </Button>
      </Heading>

      <Cell data={data.accountMailboxes} success={AccountMailboxes} />
    </>
  )
}

export default SettingsPage
