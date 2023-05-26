import { createForm, Field, Form, getValue, minRange, setValue } from "@modular-forms/solid"
import { repeat } from "lodash"
import { TbCalendarEvent, TbChevronDown, TbSwitch3 } from "solid-icons/tb"
import { Component, createEffect, For, Show } from "solid-js"
import toast from "solid-toast"
import { CreateTransactionInput } from "../../graphql-types"
import { useCreateTransaction } from "../../graphql/mutations/createTransactionMutation"
import { useAccountsQuery } from "../../graphql/queries/accountsQuery"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import { useCurrentUserQuery } from "../../graphql/queries/currentUserQuery"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "../../utils/categoryColors"
import { Button } from "../base/Button"
import { InputAddon } from "../base/InputGroup"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { FormDatePicker } from "../forms/FormDatePicker"
import FormInput from "../forms/FormInput"
import FormInputGroup from "../forms/FormInputGroup"

type NewTransactionModalValues = CreateTransactionInput & { amountType: "expense" | "income" }

export const NewTransactionModal: Component<{
  initialDate?: Date
  isOpen: boolean
  onClose: () => void
}> = (props) => {
  const categories = useCategoriesQuery()
  const currencies = useCurrenciesQuery()
  const accounts = useAccountsQuery()
  const currentUser = useCurrentUserQuery()

  const createTransaction = useCreateTransaction({
    onSuccess: () => {
      toast.success("Transaction created")
      props.onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const [form] = createForm<NewTransactionModalValues>({
    initialValues: {
      date: props.initialDate && props.initialDate.toISOString().split("T")[0],
      amountType: "expense"
    }
  })

  let memoInput: HTMLInputElement | undefined

  createEffect(() => {
    if (isDateSelected()) {
      memoInput?.focus()
    }
  })

  createEffect(() => {
    if (currentUser()?.currentUser && !getValue(form, "currencyCode")) {
      setValue(form, "currencyCode", currentUser()!.currentUser!.defaultCurrency.code)
    }
  })

  createEffect(() => {
    if (currentUser()?.currentUser && !getValue(form, "accountId")) {
      setValue(form, "accountId", currentUser()!.currentUser!.defaultAccount?.id || "")
    }
  })

  const onSave = ({ amount, amountType, date, ...data }: NewTransactionModalValues) => {
    const currency = currencies()?.currencies.find(
      (currency) => currency.code === data.currencyCode
    )
    const integerAmount = Math.round(amount * 10 ** (currency?.decimalDigits || 0))

    const coercedData = {
      ...data,
      amount: amountType === "expense" ? -integerAmount : integerAmount,
      date: new Date(date).toISOString().split("T")[0],
      includeInReports: Boolean(data.includeInReports)
    }

    createTransaction({ input: coercedData })
  }

  const isDateSelected = () => {
    return getValue(form, "date")
  }

  const selectedCurrency = () =>
    currencies()?.currencies.find((currency) => currency.code === getValue(form, "currencyCode"))

  const selectedCategory = () =>
    categories()?.categories.find((category) => category.id === getValue(form, "categoryId"))

  return (
    <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
      <ModalContent class="flex h-[26rem] flex-col">
        <ModalTitle>
          New Transaction
          <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <Form of={form} onSubmit={onSave} class="flex flex-1 flex-col justify-center">
          <FormDatePicker
            of={form}
            label="Date"
            labelHidden={true}
            name="date"
            maxDate={new Date()}
            class={isDateSelected() ? "hidden" : ""}
          />

          <div classList={{ hidden: !isDateSelected() }} class="flex flex-1 flex-col gap-4">
            <div class="my-auto flex flex-col gap-2">
              <FormInput
                placeholderLabel={true}
                of={form}
                ref={memoInput}
                label="Memo"
                name="memo"
              />

              <FormInputGroup
                of={form}
                label="Amount"
                name="amount"
                type="number"
                placeholderLabel={true}
                validate={minRange(0, "Must be zero or more")}
                before={<InputAddon>{selectedCurrency()?.symbol}</InputAddon>}
                step={
                  selectedCurrency()?.decimalDigits
                    ? `0.${repeat("0", selectedCurrency()!.decimalDigits - 1)}1`
                    : "1"
                }
              />
            </div>

            <div class="flex gap-4">
              <Field of={form} name="amountType">
                {(field) => (
                  <Button
                    size="custom"
                    variant="ghost"
                    class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                    onClick={() =>
                      setValue(form, "amountType", field.value === "income" ? "expense" : "income")
                    }
                  >
                    {field.value === "income" ? "Income" : "Expense"}
                    <TbSwitch3 class="ml-1" />
                  </Button>
                )}
              </Field>

              <Show when={getValue(form, "amountType") !== "income"}>
                <Field of={form} name="categoryId">
                  {(field) => (
                    <Dropdown
                      closeOnItemClick
                      class="min-w-0"
                      content={
                        <For each={categories()?.categories}>
                          {(category) => (
                            <DropdownMenuItem
                              class="text-sm"
                              onClick={() => setValue(form, "categoryId", category.id)}
                            >
                              <div
                                class={`h-2 w-2 rounded-full ${
                                  CATEGORY_BACKGROUND_COLORS[category.color as CategoryColor]
                                }`}
                              />
                              {category.name}
                            </DropdownMenuItem>
                          )}
                        </For>
                      }
                    >
                      <Button
                        size="custom"
                        variant="ghost"
                        class="w-full rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                      >
                        <Show when={selectedCategory()}>
                          <div
                            class={`mr-2 h-2 w-2 rounded-full ${
                              CATEGORY_BACKGROUND_COLORS[selectedCategory()!.color as CategoryColor]
                            }`}
                          />
                        </Show>
                        <span class="min-w-0 truncate">
                          {selectedCategory()?.name || "No category"}
                        </span>
                        <TbChevronDown class="ml-1" />
                      </Button>
                    </Dropdown>
                  )}
                </Field>
              </Show>

              <Button
                size="custom"
                variant="ghost"
                class="whitespace-nowrap rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                onClick={() => setValue(form, "date", "")}
              >
                <TbCalendarEvent class="mr-1" />
                {getValue(form, "date")}
              </Button>
            </div>

            <div class="mb-2 flex gap-4">
              <Field of={form} name="currencyCode">
                {(field) => (
                  <Dropdown
                    closeOnItemClick
                    content={
                      <For each={currencies()?.currencies}>
                        {(currency) => (
                          <DropdownMenuItem
                            class="text-sm"
                            onClick={() => setValue(form, "currencyCode", currency.code)}
                          >
                            {currency.code}
                          </DropdownMenuItem>
                        )}
                      </For>
                    }
                  >
                    <Button
                      size="custom"
                      variant="ghost"
                      class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                    >
                      {
                        currencies()?.currencies.find((currency) => currency.code === field.value)
                          ?.code
                      }
                      <TbChevronDown class="ml-1" />
                    </Button>
                  </Dropdown>
                )}
              </Field>

              <Field of={form} name="accountId">
                {(field) => (
                  <Dropdown
                    closeOnItemClick
                    content={
                      <For each={accounts()?.accounts}>
                        {(account) => (
                          <DropdownMenuItem
                            class="text-sm"
                            onClick={() => setValue(form, "accountId", account.id)}
                          >
                            {account.name}
                          </DropdownMenuItem>
                        )}
                      </For>
                    }
                  >
                    <Button
                      size="custom"
                      variant="ghost"
                      class="rounded border border-gray-100 px-4 py-2 text-xs text-gray-700"
                    >
                      {accounts()?.accounts.find((account) => account.id === field.value)?.name}
                      <TbChevronDown class="ml-1" />
                    </Button>
                  </Dropdown>
                )}
              </Field>
            </div>

            <Button
              type="submit"
              colorScheme="primary"
              class="mt-auto w-full"
              disabled={createTransaction.loading}
            >
              Save
            </Button>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  )
}
