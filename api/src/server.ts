import { file } from "bun"
import { existsSync, statSync } from "fs"
import { createYoga } from "graphql-yoga"
import { buildContext } from "./context"
import { createDb } from "./db/createDb"
import { migrate } from "./db/migrations/migrate"
import { startExchangeRateSchedule } from "./jobs/exchangeRates"
import "./polyfills"
import { schema } from "./schema"

if (process.env.NODE_ENV === "test") {
  await createDb()
  await migrate()
}

const port = process.env.PORT || 4444

startExchangeRateSchedule()

const yoga = createYoga({
  schema,
  context: ({ request }) => buildContext(request),

  cors:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          origin: process.env.WEB_URL || "http://localhost:1235",
          allowedHeaders: ["Authorization", "Content-Type"]
        },

  // maskedErrors: process.env.NODE_ENV !== "production"
  maskedErrors: false
})

Bun.serve({
  port,

  async fetch(req) {
    const url = new URL(req.url)

    console.log(`[HTTP] ${req.method} ${url.pathname}${url.search}${url.hash}`)

    if (url.pathname !== "/graphql") {
      if (process.env.STATIC_PATH) {
        const path = `${process.env.STATIC_PATH}${url.pathname}`

        if (existsSync(path) && statSync(path).isFile()) {
          return new Response(file(path))
        } else {
          return new Response(file(`${process.env.STATIC_PATH}/index.html`))
        }
      }

      return new Response("Not found", {
        status: 404
      })
    }

    return yoga.fetch(req)
  }
})

console.log(`Listening on port ${port}`)
