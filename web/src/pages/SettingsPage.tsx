import { startRegistration } from "@simplewebauthn/browser"
import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import DeviceDetector from "device-detector-js"
import { TbFingerprint, TbKey, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import AccountMailboxes from "../components/accountMailboxes/AccountMailboxes"
import { Button, LinkButton } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import CategoriesList from "../components/categories/Categories"
import { Cell } from "../components/Cell"
import { AddCurrencyButton } from "../components/currencies/AddCurrencyButton"
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
import { useDeleteCredential } from "../graphql/mutations/deleteCredential"
import { useRegisterCredential } from "../graphql/mutations/registerCredentialMutation"
import { useVerifyCredentialRegistration } from "../graphql/mutations/verifyCredentialRegistrationMutation"
import { setLoginToken } from "../utils/auth"
import { QueryResource } from "../utils/graphqlClient/useQuery"

export interface SettingsPageData {
  categories: QueryResource<CategoriesQuery, CategoriesQueryVariables>
  accountMailboxes: QueryResource<AccountMailboxesQuery, AccountMailboxesQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  currencies: QueryResource<CurrenciesQuery, CurrenciesQueryVariables>
  currentExchangeRates: QueryResource<CurrentExchangeRatesQuery, CurrentExchangeRatesQueryVariables>
}

const deviceDetector = new DeviceDetector()

const SettingsPage: Component = () => {
  const data = useRouteData<SettingsPageData>()
  const registerCredential = useRegisterCredential({
    onSuccess: async (data) => {
      const response = await startRegistration(data.registerCredential)
      const { client, device, os } = deviceDetector.parse(navigator.userAgent)
      const deviceString = [
        client?.name || "Unknown browser",
        "on",
        device?.type,
        device?.brand || "unknown",
        device?.model,
        os?.name
      ]
        .filter(Boolean)
        .join(" ")

      await verifyCredentialRegistration({ response, device: deviceString })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  const verifyCredentialRegistration = useVerifyCredentialRegistration({
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const deleteCredential = useDeleteCredential({
    onSuccess: async () => {
      toast.success("Credential deleted.")
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

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
        Login Methods
        <Button
          class="ml-auto"
          size="sm"
          colorScheme="primary"
          onClick={() => registerCredential({})}
        >
          Register fingerprint, face ID, ...
        </Button>
      </PageHeader>

      <div class="flex items-center gap-2 bg-white py-2 px-4 shadow-sm">
        <TbKey /> Password
      </div>
      <For each={data.currentUser()?.currentUser?.registeredCredentials}>
        {(credential) => (
          <div class="flex items-center gap-2 bg-white  py-2 px-4 shadow-sm">
            <TbFingerprint /> {credential.device} (created on {credential.createdAt})
            <Button
              size="sm"
              variant="ghost"
              colorScheme="danger"
              class="ml-auto"
              onClick={() => deleteCredential({ id: credential.id })}
            >
              <TbTrash />
            </Button>
          </div>
        )}
      </For>

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

      <PageHeader size="lg">
        Currencies <AddCurrencyButton />
      </PageHeader>

      <Cell data={data.currencies} success={Currencies} />

      <PageHeader size="lg">Current Exchange Rates</PageHeader>

      <Cell data={data.currentExchangeRates} success={CurrentExchangeRates} />
    </>
  )
}

export default SettingsPage
