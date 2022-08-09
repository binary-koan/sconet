import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL
} from "graphql-helix"
import { schema } from "./schema"

Bun.serve({
  port: 4444,

  async fetch(req) {
    req.headers // fixes segfault

    console.log(req)

    const url = new URL(req.url)

    if (url.pathname !== "/graphql") {
      return new Response("Not found", {
        status: 404
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
          headers: result.headers.map(({ name, value }) => [name, value])
        })
      }

      throw new Error(`Unhandled result type: ${result.type}`)
    }
  }
})
