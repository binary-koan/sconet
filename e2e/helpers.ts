import { Page, expect } from "./fixtures"

export async function expectToast(page: Page, matcher: string | RegExp) {
  await expect(page.locator(".sldt-active")).toHaveText(matcher)
}
