import { file } from "bun"
import { existsSync, statSync } from "fs"
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL
} from "graphql-helix"
import { buildContext } from "./context"
import "./polyfills"
import { schema } from "./schema"

const corsHeaders: Array<[string, string]> = [
  ["Access-Control-Allow-Origin", "http://localhost:1234"],
  ["Access-Control-Allow-Headers", "Authorization, Content-Type"]
]

const port = process.env.PORT || 4444

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

    if (req.method === "OPTIONS") {
      return new Response("", {
        headers: corsHeaders
      })
    }

    const body = await req.json()

    const request = {
      body,
      headers: req.headers,
      method: req.method,
      query: url.search
    }

    if (shouldRenderGraphiQL(request)) {
      return new Response(renderGraphiQL())
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request)

      console.log(`[GRAPHQL] ${operationName || "unnamed operation"}`)

      const result = await processRequest({
        contextFactory: (executionContext) => buildContext(req, executionContext),
        operationName,
        query,
        variables,
        request,
        schema
      })

      if (result.type === "RESPONSE") {
        result.payload.errors?.forEach((error) => console.error(error.originalError || error))

        const data = JSON.stringify(result.payload)

        console.log(`[GRAPHQL] Done`)

        return new Response(data, {
          status: result.status,
          headers: result.headers
            .map<[string, string]>(({ name, value }) => [name, value])
            .concat(corsHeaders)
        })
      }

      throw new Error(`Unhandled result type: ${result.type}`)
    }
  }
})

console.log(`Listening on port ${port}`)
