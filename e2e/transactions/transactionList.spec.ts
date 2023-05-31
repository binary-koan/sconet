import { createAccount, createCategory, createTransaction } from "../factories"
import { expect, test } from "../fixtures"
import { resetDb } from "../helpers"

test("shows transactions and days in between", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "test", currencyCode: "USD" })

  await createTransaction({
    date: "2020-01-01",
    amount: -123,
    currencyCode: "USD",
    memo: "test",
    accountId: account.id
  })

  await createTransaction({
    date: "2020-01-07",
    amount: -234,
    currencyCode: "USD",
    memo: "test2",
    accountId: account.id
  })

  await page.goto("/transactions")

  await expect(page.getByTestId("transaction-item")).toHaveCount(2)
  await expect(page.getByTestId("transaction-item").getByTestId("memo").nth(0)).toHaveText("test2")
  await expect(page.getByTestId("transaction-item").getByTestId("amount").nth(0)).toHaveText(
    "-$2.34"
  )
  await expect(page.getByTestId("transaction-item").getByTestId("memo").nth(1)).toHaveText("test")
  await expect(page.getByTestId("transaction-item").getByTestId("amount").nth(1)).toHaveText(
    "-$1.23"
  )

  await expect(page.locator('[data-testid="transactions-date"]')).toHaveCount(7)
  await expect(page.locator('[data-testid="transactions-date"]').nth(0)).toHaveText("Tue, Jan 7")
  await expect(page.locator('[data-testid="transactions-date"]').nth(6)).toHaveText("Wed, Jan 1")
})

test("supports pagination", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "test", currencyCode: "USD" })

  await createTransaction({
    date: "2020-01-01",
    amount: -123,
    currencyCode: "USD",
    memo: "test",
    accountId: account.id
  })

  await createTransaction({
    date: "2020-01-07",
    amount: -123,
    currencyCode: "USD",
    memo: "test2",
    accountId: account.id
  })

  await createTransaction({
    date: "2020-01-10",
    amount: -123,
    currencyCode: "USD",
    memo: "test3",
    accountId: account.id
  })

  await page.goto("/transactions/list?limit=2")

  await expect(page.getByTestId("transaction-item")).toHaveCount(2)
  await expect(page.getByTestId("transaction-item").getByTestId("memo").nth(0)).toHaveText("test3")
  await expect(page.getByTestId("transaction-item").getByTestId("memo").nth(1)).toHaveText("test2")

  await page.getByRole("button", { name: "Fetch more" }).click()

  await expect(page.getByTestId("transaction-item")).toHaveCount(3)
  await expect(page.getByTestId("transaction-item").getByTestId("memo").nth(2)).toHaveText("test")
})

test("supports filtering", async ({ page }) => {
  await resetDb()

  const account = await createAccount({ name: "Sock Account", currencyCode: "USD" })
  const category = await createCategory({
    name: "Socks",
    color: "red",
    icon: "Sock",
    isRegular: true
  })

  await createTransaction({
    date: "2020-01-01",
    amount: -123,
    currencyCode: "USD",
    memo: "one",
    accountId: account.id,
    categoryId: category.id
  })

  await createTransaction({
    date: "2020-01-07",
    amount: 123,
    currencyCode: "USD",
    memo: "two",
    accountId: account.id
  })

  await page.goto("/transactions/list")

  await expect(page.getByTestId("transaction-item")).toHaveCount(2)

  await page.getByRole("button", { name: "Filter" }).click()

  await page.getByTestId("filters-container").getByLabel("Filter").fill("one")

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("one")

  await page.getByTestId("filters-container").getByLabel("Filter").fill("")
  await page.getByTestId("filters-container").getByLabel("Show from").fill("2020-01-02")

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("two")

  await page.getByTestId("filters-container").getByLabel("Show from").fill("")
  await page.getByTestId("filters-container").getByLabel("Show until").fill("2020-01-02")

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("one")

  await page.getByTestId("filters-container").getByLabel("Show until").fill("")
  await page.getByTestId("filters-container").getByLabel("Value over (cents)").fill("1")

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("two")

  await page.getByTestId("filters-container").getByLabel("Value over (cents)").fill("")
  await page.getByTestId("filters-container").getByLabel("Value under (cents)").fill("-1")

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("one")

  await page.getByTestId("filters-container").getByLabel("Value under (cents)").fill("")

  await page.getByTestId("filters-container").getByRole("button", { name: "Uncategorized" }).click()

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("two")

  await page.getByTestId("filters-container").getByRole("button", { name: "Uncategorized" }).click()
  await page.getByTestId("filters-container").getByRole("button", { name: "Socks" }).click()

  await expect(page.getByTestId("transaction-item")).toHaveCount(1)
  await expect(page.getByTestId("transaction-item").getByTestId("memo")).toHaveText("one")
})
