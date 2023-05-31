import { createAccount, createCategory } from "../factories"
import { expect, test } from "../fixtures"
import { expectToast } from "../helpers"

test("can create an expense transaction", async ({ page }) => {
  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.locator("button[data-testid=datepicker-date]").nth(10).click()
  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="memo"]')).toHaveText(
    "test"
  )
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="amount"]')).toHaveText(
    "-$1.23"
  )
})

test("can create a transaction with category and account", async ({ page, request }) => {
  await createAccount({ name: "My Account", currencyCode: "JPY" })
  await createCategory({
    name: "My Category",
    color: "red",
    icon: "Sock",
    isRegular: true
  })

  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.locator("button[data-testid=datepicker-date]").nth(10).click()
  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("344")

  await page.getByTestId("category-select").click()
  await page.getByTestId("category-item").and(page.getByText("My Category")).click()

  await page.getByTestId("account-select").click()
  await page.getByTestId("account-item").and(page.getByText("My Account")).click()

  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="memo"]')).toHaveText(
    "test"
  )
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="amount"]')).toHaveText(
    "-¥344"
  )
  await expect(
    page.locator('[data-testid="transaction-item"] [data-testid="category-name"]')
  ).toHaveText("My Category")
})

test("can create an income transaction", async ({ page }) => {
  await page.goto("/transactions")

  await page.getByRole("button", { name: "Add" }).click()
  await page.locator("button[data-testid=datepicker-date]").nth(10).click()

  await page.getByRole("button", { name: "Expense" }).click()
  await expect(page.getByTestId("category-select")).toHaveCount(0)

  await page.getByLabel("Memo").fill("test")
  await page.getByLabel("Amount").fill("1.23")
  await page.getByRole("button", { name: "Save" }).click()

  await expectToast(page, "Transaction created")
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="memo"]')).toHaveText(
    "test"
  )
  await expect(page.locator('[data-testid="transaction-item"] [data-testid="amount"]')).toHaveText(
    "$1.23"
  )
})
