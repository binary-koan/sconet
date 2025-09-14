import { startRegistration } from "@simplewebauthn/browser"
import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import DeviceDetector from "device-detector-js"
import { IconFingerprint, IconKey, IconTrash } from "@tabler/icons-solidjs"
import { Component, For, Show, createSignal } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../components/Cell"
import Accounts from "../components/accounts/AccountsList"
import { Button, LinkButton } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import { CategoriesList } from "../components/categories/CategoriesList"
import { CurrentUserProfile } from "../components/user/CurrentUserProfile"
import { FavouriteCurrencies } from "../components/user/FavouriteCurrencies"
import { FavouriteTransactionsList } from "../components/transactions/FavouriteTransactionsList"
import { FavouriteTransactionNewModal } from "../components/transactions/FavouriteTransactionNewModal"
import {
  AccountsQuery,
  AccountsQueryVariables,
  CategoriesQuery,
  CategoriesQueryVariables,
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
  accounts: QueryResource<AccountsQuery, AccountsQueryVariables>
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  favouriteTransactions: QueryResource<any, any>
}

const deviceDetector = new DeviceDetector()

const SettingsPage: Component = () => {
  const data = useRouteData<SettingsPageData>()
  const [favModalOpen, setFavModalOpen] = createSignal(false)
  const registerCredential = useRegisterCredential({
    onSuccess: async (data) => {
      const response = await startRegistration(data.credentialRegistrationStart.options)
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
    }
  })
  const verifyCredentialRegistration = useVerifyCredentialRegistration()

  const deleteCredential = useDeleteCredential({
    onSuccess: async () => {
      toast.success("Credential deleted.")
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
      <Cell data={data.currentUser} success={CurrentUserProfile} />

      <PageHeader size="lg" class="mt-4">
        Login methods
        <Button
          class="ml-auto"
          size="sm"
          colorScheme="primary"
          onClick={() => registerCredential({})}
        >
          Register fingerprint, face ID, ...
        </Button>
      </PageHeader>

      <div class="shadow-xs flex items-center gap-2 bg-white px-4 py-2">
        <IconKey /> Password
      </div>
      <For each={data.currentUser()?.currentUser?.registeredCredentials}>
        {(credential) => (
          <div class="shadow-xs flex items-center gap-2  bg-white px-4 py-2">
            <IconFingerprint /> {credential.device} (created on {credential.createdAt})
            <Button
              size="sm"
              variant="ghost"
              colorScheme="danger"
              class="ml-auto"
              onClick={() => deleteCredential({ id: credential.id })}
            >
              <IconTrash />
            </Button>
          </div>
        )}
      </For>

      <PageHeader size="lg" class="mt-4">
        Favourite currencies
        <LinkButton href="/settings/currencies" class="ml-auto" size="sm" colorScheme="primary">
          Manage
        </LinkButton>
      </PageHeader>

      <Cell data={data.currentUser} success={FavouriteCurrencies} />

      <PageHeader size="lg" class="mt-4">
        Favourite transactions
        <Button
          class="ml-auto"
          size="sm"
          colorScheme="primary"
          onClick={() => setFavModalOpen(true)}
        >
          New Favourite
        </Button>
      </PageHeader>

      <Show when={data.favouriteTransactions()?.favouriteTransactions}>
        <FavouriteTransactionsList data={data.favouriteTransactions()!} />
      </Show>

      <FavouriteTransactionNewModal
        isOpen={favModalOpen()}
        onClose={() => setFavModalOpen(false)}
        onCreated={() => data.favouriteTransactions.refetch()}
      />

      <PageHeader size="lg" class="mt-4">
        Categories
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/categories/new">
          New Category
        </LinkButton>
      </PageHeader>

      <Cell data={data.categories} success={CategoriesList} />

      <PageHeader size="lg" class="mt-4">
        Accounts
        <LinkButton class="ml-auto" size="sm" colorScheme="primary" href="/accounts/new">
          New Account
        </LinkButton>
      </PageHeader>

      <Cell
        data={data.accounts}
        success={Accounts}
        successProps={{ currentUser: data.currentUser() }}
      />
    </>
  )
}

export default SettingsPage
