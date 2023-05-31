import { createAccount, createCategory, createTransaction } from "../factories"
import { expect, test } from "../fixtures"
import { expectToast, resetDb } from "../helpers"

test("can create an expense transaction", async ({ page }) => {
  await resetDb()

  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.getByTestId("datepicker-date").getByText("1").nth(0).click()
  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("test")
  await expect(page.getByTestId("transaction-item").getByTestId("amount")).toHaveText("-$1.23")
})

test("can create a transaction with category and account", async ({ page }) => {
  await resetDb()

  await createAccount({ name: "My Account", currencyCode: "JPY" })
  await createCategory({
    name: "My Category",
    color: "red",
    icon: "Sock",
    isRegular: true
  })

  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.getByTestId("datepicker-date").getByText("1").nth(0).click()
  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("344")

  await page.getByTestId("category-select").click()
  await page.getByTestId("category-item").and(page.getByText("My Category")).click()

  await page.getByTestId("account-select").click()
  await page.getByTestId("account-item").and(page.getByText("My Account")).click()

  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("test")
  await expect(page.getByTestId("transaction-item").getByTestId("amount")).toHaveText("-¥344")
  await expect(page.getByTestId("transaction-item").getByTestId("category-name")).toHaveText(
    "My Category"
  )
})

test("can create an income transaction", async ({ page }) => {
  await resetDb()

  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.getByTestId("datepicker-date").getByText("1").nth(0).click()

  await page.getByRole("button", { name: "Expense" }).click()
  await expect(page.getByTestId("category-select")).toHaveCount(0)

  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("test")
  await expect(page.getByTestId("transaction-item").getByTestId("amount")).toHaveText("$1.23")
})

test("can create another transaction on the same day as an existing one", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "Sock Account", currencyCode: "USD" })

  await createTransaction({
    date: "2020-01-01",
    amount: -300,
    currencyCode: "USD",
    memo: "test",
    accountId: account.id
  })

  await page.goto("/transactions")

  await page.getByTestId("transactions-date").getByRole("button").click()

  await page.getByLabel("Memo").fill("other")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.getByTestId("transaction-item")).toHaveCount(2)
  await expect(page.getByTestId("transaction-item").nth(1).getByTestId("memo")).toHaveText("other")
  await expect(page.getByTestId("transaction-item").nth(1).getByTestId("amount")).toHaveText(
    "-$1.23"
  )
})

test("can create a transaction via the calendar", async ({ page }) => {
  await resetDb()

  await page.goto("/transactions/calendar")

  await expect(page.getByTestId("calendar-day")).toHaveCount(41)
  await expect(page.getByTestId("calendar-today")).toHaveCount(1)

  await page.getByTestId("calendar-today").getByRole("button").click()

  await page.getByLabel("Memo").fill("other")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item")).toHaveText("other-$1.23")
})
