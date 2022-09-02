import "./polyfills"
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL
} from "graphql-helix"
import { buildContext } from "./context"
import { schema } from "./schema"

const corsHeaders: Array<[string, string]> = [
  ["Access-Control-Allow-Origin", "http://localhost:3000"],
  ["Access-Control-Allow-Headers", "Authorization, Content-Type"]
]

Bun.serve({
  port: 4444,

  async fetch(req) {
    req.headers // fixes segfault

    const url = new URL(req.url)

    if (url.pathname !== "/graphql") {
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

      const result = await processRequest({
        contextFactory: (executionContext) => buildContext(req, executionContext),
        operationName,
        query,
        variables,
        request,
        schema
      })

      if (result.type === "RESPONSE") {
        const data = JSON.stringify(result.payload)

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

console.log("Listening on port 4444")
