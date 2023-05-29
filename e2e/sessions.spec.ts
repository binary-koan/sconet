import { expect, test } from "@playwright/test"
import { expectToast } from "./helpers"

test("redirects to login", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveURL(/\/login/)
})

test("shows an error with invalid credentials", async ({ page }) => {
  await page.goto("/login")

  await page.keyboard.type("test@example.com")
  await page.keyboard.press("Tab")
  await page.keyboard.type("whatever")
  await page.getByRole("button", { name: "Login" }).click()

  await expectToast(page, /Invalid email or password/)
})
