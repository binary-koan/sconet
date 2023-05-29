import { test as baseTest } from "@playwright/test"
import fs from "fs"
import path from "path"

export * from "@playwright/test"

export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser }, use) => {
      const index = test.info().parallelIndex
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${index}.json`)

      if (fs.existsSync(fileName)) {
        await use(fileName)
        return
      }

      const page = await browser.newPage({ storageState: undefined })

      await page.goto("/login")
      await page.getByLabel("Email").fill(`test+${index}@example.com`)
      await page.getByLabel("Password").fill("changeme")
      await page.getByRole("button", { name: "Sign in" }).click()

      await page.waitForURL("/transactions")

      await page.context().storageState({ path: fileName })
      await page.close()
      await use(fileName)
    },
    { scope: "worker" }
  ]
})
