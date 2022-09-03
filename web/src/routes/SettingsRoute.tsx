import { Heading, Button, Text } from "@hope-ui/solid"
import { Title } from "@solidjs/meta"
import { Link, Route, useRouteData } from "@solidjs/router"
import { Component, Resource } from "solid-js"
import { CategoriesCell, CATEGORIES_QUERY } from "../components/categories/CategoriesCell"
import { FindCategoriesQuery } from "../graphql-types"
import { useQuery } from "../graphqlClient"

type SettingsPageData = () => { categories: Resource<FindCategoriesQuery> }

const SettingsPage: Component = () => {
  const data = useRouteData<SettingsPageData>()

  const toggleColorMode = () => {}
  const logOut = () => {}
  const currentUser = { email: "TODO" }

  return (
    <>
      <Title>Settings</Title>

      <Heading
        fontSize={{ "@initial": "lg", "@lg": "3xl" }}
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
        boxShadow="xs"
        paddingTop="$2"
        paddingBottom="$2"
        paddingStart="$4"
        paddingEnd="$4"
        background="$neutral1"
      >
        {currentUser.email}
      </Text>

      <Heading
        fontSize={{ "@initial": "lg", "@lg": "3xl" }}
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

      <CategoriesCell data={data.categories} />

      <Heading
        fontSize={{ "@initial": "lg", "@lg": "3xl" }}
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

      {/* <AccountMailboxesCell /> */}
    </>
  )
}

const settingsData: SettingsPageData = () => {
  const [data] = useQuery<FindCategoriesQuery>(CATEGORIES_QUERY)

  return { categories: data }
}

export const SettingsRoute: Component = () => {
  return <Route path="/settings" component={SettingsPage} data={settingsData} />
}
