import { createForm, Field, Form, getValue, setValue } from "@modular-forms/solid"
import { TbCalendarEvent, TbChevronDown, TbSwitch3 } from "solid-icons/tb"
import { Component, createEffect, For, Show } from "solid-js"
import toast from "solid-toast"
import { CreateTransactionInput } from "../../graphql-types"
import { useCreateTransaction } from "../../graphql/mutations/createTransactionMutation"
import { useAccountMailboxesQuery } from "../../graphql/queries/accountMailboxesQuery"
import { useCategoriesQuery } from "../../graphql/queries/categoriesQuery"
import { useCurrenciesQuery } from "../../graphql/queries/currenciesQuery"
import {
  preferredAccount,
  preferredCurrency,
  setPreferredAccount,
  setPreferredCurrency
} from "../../utils/settings"
import { Button } from "../base/Button"
import { Modal, ModalCloseButton, ModalContent, ModalTitle } from "../base/Modal"
import { Dropdown, DropdownMenuItem } from "../Dropdown"
import { FormDatePicker } from "../forms/FormDatePicker"
import FormInput from "../forms/FormInput"

type NewTransactionModalValues = CreateTransactionInput & { amountType: "expense" | "income" }

export const NewTransactionModal: Component<{
  initialDate?: Date
  isOpen: boolean
  onClose: () => void
}> = (props) => {
  const categories = useCategoriesQuery()
  const currencies = useCurrenciesQuery()
  const accountMailboxes = useAccountMailboxesQuery()

  const createTransaction = useCreateTransaction({
    onSuccess: () => {
      toast.success("Transaction created")
      props.onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const form = createForm<NewTransactionModalValues>({
    initialValues: {
      date: props.initialDate && props.initialDate.toISOString().split("T")[0],
      amountType: "expense"
    }
  })

  let amountInput: HTMLInputElement | undefined

  createEffect(() => {
    if (isDateSelected()) {
      amountInput?.focus()
    }
  })

  createEffect(() => {
    if (currencies()?.currencies && !getValue(form, "currencyId")) {
      setValue(
        form,
        "currencyId",
        currencies()!.currencies.find((currency) => currency.id === preferredCurrency())?.id ||
          currencies()!.currencies[0]!.id
      )
    }
  })

  createEffect(() => {
    if (getValue(form, "currencyId")) {
      setPreferredCurrency(getValue(form, "currencyId")!)
    }
  })

  createEffect(() => {
    if (accountMailboxes()?.accountMailboxes && !getValue(form, "accountMailboxId")) {
      setValue(
        form,
        "accountMailboxId",
        accountMailboxes()!.accountMailboxes.find(
          (accountMailbox) => accountMailbox.id === preferredAccount()
        )?.id || accountMailboxes()!.accountMailboxes[0]!.id
      )
    }
  })

  createEffect(() => {
    if (getValue(form, "accountMailboxId")) {
      setPreferredAccount(getValue(form, "accountMailboxId")!)
    }
  })

  const onSave = ({ amount, amountType, date, ...data }: NewTransactionModalValues) => {
    const currency = currencies()?.currencies.find((currency) => currency.id === data.currencyId)
    const integerAmount = Math.floor(amount * 10 ** (currency?.decimalDigits || 0))

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

  return (
    <Modal isOpen={props.isOpen} onClickOutside={props.onClose}>
      <ModalContent class="flex h-[26rem] flex-col">
        <ModalTitle>
          New Transaction
          <Show when={isDateSelected()}>
            <Button
              size="custom"
              variant="ghost"
              class="ml-2 -mb-1 px-2 py-1 text-xs text-gray-700"
              onClick={() => setValue(form, "date", "")}
            >
              <TbCalendarEvent class="mr-1" />
              {getValue(form, "date")}
            </Button>
          </Show>
          <ModalCloseButton onClick={props.onClose} />
        </ModalTitle>

        <Form of={form} onSubmit={onSave} class="flex flex-1 flex-col justify-center">
          <FormDatePicker
            of={form}
            label="Date"
            labelHidden={true}
            name="date"
            class={isDateSelected() ? "hidden" : ""}
          />

          <div classList={{ hidden: !isDateSelected() }} class="flex flex-1 flex-col">
            <div class="mt-auto flex flex-col gap-4">
              <FormInput
                placeholderLabel={true}
                ref={amountInput}
                of={form}
                label="Amount"
                name="amount"
              />
              <FormInput placeholderLabel={true} of={form} label="Memo" name="memo" />
            </div>

            <div class="-ml-2 mt-auto mb-6 flex items-center gap-2">
              <Field of={form} name="amountType">
                {(field) => (
                  <Button
                    size="custom"
                    variant="ghost"
                    class="px-2 py-1 text-xs text-gray-700"
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
                      class="min-w-0"
                      content={
                        <For each={categories()?.categories}>
                          {(category) => (
                            <DropdownMenuItem
                              onClick={() => setValue(form, "categoryId", category.id)}
                            >
                              {category.name}
                            </DropdownMenuItem>
                          )}
                        </For>
                      }
                    >
                      <Button
                        size="custom"
                        variant="ghost"
                        class="w-full px-2 py-1 text-xs text-gray-700"
                      >
                        <span class="min-w-0 truncate">
                          {categories()?.categories.find((category) => category.id === field.value)
                            ?.name || "No category"}
                        </span>
                        <TbChevronDown class="ml-1" />
                      </Button>
                    </Dropdown>
                  )}
                </Field>
              </Show>

              <Field of={form} name="currencyId">
                {(field) => (
                  <Dropdown
                    content={
                      <For each={currencies()?.currencies}>
                        {(currency) => (
                          <DropdownMenuItem
                            onClick={() => setValue(form, "currencyId", currency.id)}
                          >
                            {currency.code}
                          </DropdownMenuItem>
                        )}
                      </For>
                    }
                  >
                    <Button size="custom" variant="ghost" class="px-2 py-1 text-xs text-gray-700">
                      {
                        currencies()?.currencies.find((currency) => currency.id === field.value)
                          ?.code
                      }
                      <TbChevronDown class="ml-1" />
                    </Button>
                  </Dropdown>
                )}
              </Field>

              <Field of={form} name="accountMailboxId">
                {(field) => (
                  <Dropdown
                    content={
                      <For each={accountMailboxes()?.accountMailboxes}>
                        {(accountMailbox) => (
                          <DropdownMenuItem
                            onClick={() => setValue(form, "accountMailboxId", accountMailbox.id)}
                          >
                            {accountMailbox.name}
                          </DropdownMenuItem>
                        )}
                      </For>
                    }
                  >
                    <Button size="custom" variant="ghost" class="px-2 py-1 text-xs text-gray-700">
                      {
                        accountMailboxes()?.accountMailboxes.find(
                          (accountMailbox) => accountMailbox.id === field.value
                        )?.name
                      }
                      <TbChevronDown class="ml-1" />
                    </Button>
                  </Dropdown>
                )}
              </Field>
            </div>

            <Button
              type="submit"
              colorScheme="primary"
              class="w-full"
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
