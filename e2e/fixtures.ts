import { APIRequestContext, test as baseTest } from "@playwright/test"
import fs from "fs"
import path from "path"

export * from "@playwright/test"

let currentApiContext: APIRequestContext

export const apiContext = () => currentApiContext

export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [
    async ({ browser, playwright }, use) => {
      const index = test.info().parallelIndex
      const fileName = path.resolve(test.info().project.outputDir, `.auth/${index}.json`)

      if (fs.existsSync(fileName)) {
        await use(fileName)
        return
      }

      const page = await browser.newPage({
        baseURL: "http://localhost:4445",
        storageState: undefined
      })

      await page.goto("/login")

      await page.getByLabel("Email").fill(`test+${index}@example.com`)
      await page.getByLabel("Password").fill("changeme")
      await page.getByRole("button", { name: "Login" }).click()

      await page.waitForURL("/transactions/list")

      currentApiContext = await playwright.request.newContext({
        baseURL: "http://localhost:4445",
        extraHTTPHeaders: {
          Authorization: `Bearer ${await page.evaluate(() =>
            localStorage.getItem("sconet.loginToken")
          )}`
        }
      })

      await page.context().storageState({ path: fileName })
      await page.close()
      await use(fileName)
    },
    { scope: "worker" }
  ]
})
