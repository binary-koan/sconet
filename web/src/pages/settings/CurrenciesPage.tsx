import { useRouteData } from "@solidjs/router"
import { Component, createSignal } from "solid-js"
import toast from "solid-toast"
import { Cell } from "../../components/Cell"
import InnerPageWrapper from "../../components/InnerPageWrapper"
import { Button } from "../../components/base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../../components/base/Modal"
import { CurrenciesList } from "../../components/currencies/Currencies"
import CurrencyForm from "../../components/currencies/CurrencyForm"
import {
  CurrenciesQuery,
  CurrenciesQueryVariables,
  CurrentUserQuery,
  CurrentUserQueryVariables
} from "../../graphql-types"
import { useCreateCurrency } from "../../graphql/mutations/createCurrencyMutation"
import { QueryResource } from "../../utils/graphqlClient/useQuery"

export interface CurrenciesPageData {
  currentUser: QueryResource<CurrentUserQuery, CurrentUserQueryVariables>
  currencies: QueryResource<CurrenciesQuery, CurrenciesQueryVariables>
}

const SettingsPage: Component = () => {
  const data = useRouteData<CurrenciesPageData>()
  const [modalOpen, setModalOpen] = createSignal(false)

  const createCurrency = useCreateCurrency({
    onSuccess: () => {
      toast.success("Currency created")
      setModalOpen(false)
    }
  })

  return (
    <InnerPageWrapper
      heading="Currencies"
      backLink="/settings"
      contentBackground={false}
      actions={
        <Button size="sm" colorScheme="primary" onClick={() => setModalOpen(true)}>
          New Currency
        </Button>
      }
    >
      <Cell
        data={data.currencies}
        success={CurrenciesList}
        successProps={{ currentUser: data.currentUser() }}
      />

      <Modal isOpen={modalOpen()} onClickOutside={() => setModalOpen(false)}>
        <ModalContent>
          <ModalTitle>
            New Currency
            <ModalCloseButton onClick={() => setModalOpen(false)} />
          </ModalTitle>
          <CurrencyForm
            onSave={(input) => createCurrency({ input })}
            loading={createCurrency.loading}
          />
        </ModalContent>
      </Modal>
    </InnerPageWrapper>
  )
}

export default SettingsPage
