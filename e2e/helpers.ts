import { execSync } from "child_process"
import { Page, expect } from "./fixtures"

export async function resetDb() {
  execSync("bun dev:test resetdb", {
    stdio: "inherit"
  })
}

export async function expectToast(page: Page, matcher: string | RegExp) {
  await expect(page.locator(".sldt-active")).toHaveText(matcher)
}
