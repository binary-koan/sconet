import { file } from "bun"
import { existsSync, statSync } from "fs"
import { print } from "graphql"
import { createYoga, useErrorHandler, useLogger } from "graphql-yoga"
import { extname } from "path"
import { buildContext } from "./context"
import { db } from "./db/database"
import { schema } from "./schema"
import { dbSessionPlugin } from "./utils/runDbSession"

export async function startServer(serveStaticPaths?: string[]) {
  const port = Bun.env.PORT || 4444
  const staticPaths = serveStaticPaths || Bun.env.STATIC_PATHS?.split(",") || []

  const yoga = createYoga({
    schema,
    context: ({ request }) => buildContext(request),

    plugins: [
      useErrorHandler(async ({ errors }) => {
        if (
          errors.some(
            (error) =>
              error.message.includes("CONNECT_TIMEOUT") ||
              error.message.includes("CONNECTION_CLOSED") ||
              error.message.includes("connection error: timed out")
          )
        ) {
          await db.reconnect()
        }

        console.error("[GRAPHQL:ERROR]", errors)
      }),

      useLogger({
        skipIntrospection: true,
        logFn: (eventName, options) => {
          if (eventName === "execute-start") {
            console.log("[GRAPHQL:START]", print(options.args.document).split("\n")[0] + " ... }")
            console.log("[GRAPHQL:VARIABLES]", options.args.variableValues)
          }
          if (eventName === "execute-end") {
            console.log("[GRAPHQL:END]", print(options.args.document).split("\n")[0] + " ... }")
          }
        }
      }),

      dbSessionPlugin
    ],

    maskedErrors: Bun.env.ENV_TYPE !== "production"
  })

  function serveStaticFile(pathname: string) {
    for (const staticPath of staticPaths) {
      const path = `${staticPath}${pathname}`

      if (existsSync(path) && statSync(path).isFile()) {
        return new Response(file(path))
      }
    }
  }

  Bun.serve({
    port,

    async fetch(req) {
      const url = new URL(req.url)

      console.log(`[HTTP] ${req.method} ${url.pathname}${url.search}${url.hash}`)

      if (url.pathname === "/graphql") {
        return yoga.fetch(req)
      }

      const staticFileResponse = serveStaticFile(url.pathname)
      if (staticFileResponse) return staticFileResponse

      if (!extname(url.pathname)) {
        const indexResponse = serveStaticFile("/index.html")
        if (indexResponse) return indexResponse
      }

      return new Response("Not found", {
        status: 404
      })
    }
  })

  console.log(`Listening on port ${port}`)
}
