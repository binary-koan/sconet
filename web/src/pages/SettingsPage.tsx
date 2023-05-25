import { startRegistration } from "@simplewebauthn/browser"
import { Title } from "@solidjs/meta"
import { useRouteData } from "@solidjs/router"
import DeviceDetector from "device-detector-js"
import { TbFingerprint, TbKey, TbTrash } from "solid-icons/tb"
import { Component, For } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../components/Cell"
import Accounts from "../components/accounts/AccountsList"
import { Button, LinkButton } from "../components/base/Button"
import { PageHeader } from "../components/base/PageHeader"
import CategoriesList from "../components/categories/Categories"
import { CurrentUserProfile } from "../components/user/CurrentUserProfile"
import { FavoriteCurrencies } from "../components/user/FavoriteCurrencies"
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

      <PageHeader size="lg" class="mt-4">
        Favourite currencies
        <LinkButton href="/settings/currencies" class="ml-auto" size="sm" colorScheme="primary">
          Manage
        </LinkButton>
      </PageHeader>

      <Cell data={data.currentUser} success={FavoriteCurrencies} />

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
