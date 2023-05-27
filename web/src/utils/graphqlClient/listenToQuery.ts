import { untrack } from "solid-js"
import { createStore, reconcile } from "solid-js/store"
import { requestGraphql } from "./requestGraphql"

export type FetchMore<Data, Variables> = (
  variables: Variables,
  merge: (existingData: Data, newData: Data) => Data
) => void

export interface StoredQuery<Data> {
  inflightRequest?: Promise<any>

  get(): Data | undefined
  set(data: Data): void

  loading: boolean
  error: any

  fetch(): Promise<any>
  fetchMore: FetchMore<any, any>
  refetch(): void

  listenerCount: number
  removeListener(): void
}

export interface GraphQLContext {
  queries: {
    [query: string]: {
      [variables: string]: StoredQuery<any>
    }
  }
}

export const listenToQuery = <Data>(
  context: GraphQLContext,
  query: string,
  serializedVariables: string
) => {
  const existing: StoredQuery<Data> | undefined = context.queries[query]?.[serializedVariables]

  if (existing) {
    // console.trace("adding listener", query, serializedVariables)
    existing.listenerCount += 1

    return existing
  }

  const [store, setStore] = createStore<{ data?: Data; loading: boolean; error?: any }>({
    data: undefined,
    loading: true,
    error: undefined
  })

  // console.trace("initializing listener", query, serializedVariables)
  const storedQuery: StoredQuery<Data> = {
    listenerCount: 1,

    get: () => store.data,
    set: (newData) => setStore("data", reconcile(newData)),

    get loading() {
      return store.loading
    },

    get error() {
      return store.error
    },

    async fetch() {
      if (!storedQuery.inflightRequest) {
        if (!store.data) {
          setStore("loading", true)
        }

        storedQuery.inflightRequest = requestGraphql<Data>(query, serializedVariables)
          .then((data) => {
            delete storedQuery.inflightRequest

            storedQuery.set(data)
          })
          .catch((error) => {
            setStore("error", error)
          })
          .finally(() => {
            setStore("loading", false)
          })
      }

      return await storedQuery!.inflightRequest
    },

    async fetchMore(variables, merge) {
      if (!store.data) {
        throw new Error("Cannot fetchMore when the first result is not yet loaded")
      }

      storedQuery.inflightRequest = requestGraphql<Data>(query, JSON.stringify(variables))
        // eslint-disable-next-line solid/reactivity
        .then((newData) => {
          if (!storedQuery.inflightRequest) {
            // Something has changed in the meantime, we should cancel this
            return
          }

          if (!store.data) {
            throw new Error("Cannot fetchMore when the first result is not yet loaded")
          }

          delete storedQuery.inflightRequest

          storedQuery.set(merge(store.data, newData))
        })
        .catch((error) => {
          setStore("error", error)
        })
    },

    async refetch() {
      delete storedQuery.inflightRequest

      storedQuery.fetch()
    },

    removeListener() {
      storedQuery.listenerCount -= 1

      if (storedQuery.listenerCount === 0) {
        delete context.queries[query][serializedVariables]
      }
    }
  }

  context.queries[query] ??= {}
  context.queries[query][serializedVariables] = storedQuery

  untrack(() => storedQuery.fetch())

  return storedQuery
}
