import { createAccount, createCategory, createTransaction } from "../factories"
import { expect, test } from "../fixtures"
import { expectToast, resetDb } from "../helpers"

test("supports editing transaction properties", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "test-account", currencyCode: "USD" })

  const transaction = await createTransaction({
    date: "2020-01-01",
    amount: -123,
    currencyCode: "USD",
    memo: "test-memo",
    accountId: account.id
  })

  await page.goto(`/transactions/${transaction.id}`)

  await expect(page.getByText("test-memo")).toBeVisible()
  await expect(page.getByText("-$1.23")).toBeVisible()
  await expect(page.getByText("test-account (USD)")).toBeVisible()
  await expect(page.getByText("Wed, Jan 1, 2020")).toBeVisible()
  await expect(page.getByText("Uncategorized")).toBeVisible()

  // Edit memo

  await page.getByText("test-memo").click()
  await page.getByLabel("Edit memo").fill("")
  await page.getByLabel("Edit memo").type("new-memo")
  await page.getByRole("button", { name: "Confirm" }).click()

  await expect(page.getByText("new-memo")).toBeVisible()

  await page.getByText("new-memo").click()
  await page.getByLabel("Edit memo").fill("")
  await page.getByLabel("Edit memo").type("cancelled-memo")
  await page.getByRole("button", { name: "Cancel" }).click()

  await expect(page.getByText("new-memo")).toBeVisible()

  // Edit amount

  await page.getByText("-$1.23").click()
  await page.getByLabel("Edit amount").fill("")
  await page.getByLabel("Edit amount").type("4.56")
  await page.getByRole("button", { name: "Confirm" }).click()

  await expect(page.getByText("-$4.56")).toBeVisible()

  await page.getByText("-$4.56").click()
  await page.getByLabel("Edit amount").fill("")
  await page.getByLabel("Edit amount").type("6.54")
  await page.getByRole("button", { name: "Cancel" }).click()

  await expect(page.getByText("-$4.56")).toBeVisible()

  // Edit date

  await page.getByText("Wed, Jan 1, 2020").click()
  await page.getByLabel("Edit date").fill("2020-01-03")
  await page.getByRole("button", { name: "Confirm" }).click()

  await expect(page.getByText("Fri, Jan 3, 2020")).toBeVisible()

  await page.getByText("Fri, Jan 3, 2020").click()
  await page.getByLabel("Edit date").fill("2022-05-06")
  await page.getByRole("button", { name: "Cancel" }).click()

  await expect(page.getByText("Fri, Jan 3, 2020")).toBeVisible()

  // Edit account

  await createAccount({ name: "other-account", currencyCode: "JPY" })

  await page.getByText("test-account (USD)").click()
  await page.getByRole("button", { name: "other-account (JPY)" }).click()
  await page.getByRole("button", { name: "OK" }).click()

  await expect(page.getByRole("button", { name: "other-account (JPY)" })).not.toBeVisible()
  await expect(page.getByText("other-account (JPY)")).toBeVisible()
  await expect(page.getByText("-¥456")).toBeVisible()

  await page.getByText("other-account (JPY)").click()
  await page.getByRole("button", { name: "test-account (USD)" }).click()
  await page.getByRole("button", { name: "Cancel" }).click()

  await expect(page.getByRole("button", { name: "test-account (USD)" })).not.toBeVisible()
  await expect(page.getByText("other-account (JPY)")).toBeVisible()
  await expect(page.getByText("-¥456")).toBeVisible()

  // Edit category

  await createCategory({ name: "some-category", color: "red", icon: "Sock", isRegular: true })

  await page.getByText("Uncategorized").click()
  await page.getByRole("button", { name: "some-category" }).click()

  await expect(page.getByRole("button", { name: "some-category" })).not.toBeVisible()
  await expect(page.getByText("some-category")).toBeVisible()
})

test("showing and hiding transaction in reports", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "test-account", currencyCode: "USD" })

  const transaction = await createTransaction({
    date: "2020-01-01",
    amount: -123,
    currencyCode: "USD",
    memo: "test-memo",
    accountId: account.id
  })

  await page.goto(`/transactions/${transaction.id}`)

  // Hide in reports

  await page.getByRole("button", { name: "Hide from reports" }).click()

  await expect(page.getByText("Hidden from reports")).toBeVisible()

  await page.goto("/graphs/budgets/2020-01")

  await expect(page.getByTestId("total-spending")).toHaveText("$0.00")

  // Show in reports

  await page.goto(`/transactions/${transaction.id}`)

  await page.getByRole("button", { name: "Show in reports" }).click()

  await expect(page.getByText("Hidden from reports")).not.toBeVisible()

  await page.goto("/graphs/budgets/2020-01")

  await expect(page.getByTestId("total-spending")).toHaveText("$1.23")
})

test.only("splitting a transaction", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "test-account", currencyCode: "USD" })

  const transaction = await createTransaction({
    date: "2020-01-01",
    amount: -1234,
    currencyCode: "USD",
    memo: "test-memo",
    accountId: account.id
  })

  await page.goto(`/transactions/${transaction.id}`)

  await page.getByRole("button", { name: "Split" }).click()

  await page.getByPlaceholder("Memo").fill("split 1")
  await page.getByPlaceholder("Amount").fill("3")

  await page.getByPlaceholder("Memo").nth(1).fill("split 2")
  await page.getByPlaceholder("Amount").nth(1).fill("5.20")

  await page.getByRole("dialog").getByRole("button", { name: "Split" }).click()

  await expectToast(page, "Transaction split")

  await expect(page.getByText("split 1")).toBeVisible()
  await expect(page.getByText("-$3.00")).toBeVisible()
  await expect(page.getByText("split 2")).toBeVisible()
  await expect(page.getByText("-$5.20")).toBeVisible()
  // Remainder
  await expect(page.getByText("-$4.14")).toBeVisible()
})
