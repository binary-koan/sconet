import { useLocation, useNavigate } from "@solidjs/router"
import { Component, ErrorBoundary, JSX, Match, Switch, createEffect } from "solid-js"
import { Dynamic } from "solid-js/web"
import { setLoginToken } from "../utils/auth"
import { QueryResource } from "../utils/graphqlClient/useQuery"
import LoadingBar from "./LoadingBar"

const DefaultLoader = () => (
  <div role="status" class="mx-auto mb-4">
    <LoadingBar class="h-8 w-8 text-indigo-600" />
    <span class="sr-only">Loading...</span>
  </div>
)
const DefaultFailure: Component<{ error: any }> = (props) => (
  <div class="rounded bg-red-100 p-4 text-red-700">{props.error.message}</div>
)

export const Cell: <Data, Variables, OtherProps = never>(props: {
  data: QueryResource<Data, Variables>
  loading?: Component
  failure?: Component<{ error: any }>
  success: Component<{ data: Data } & OtherProps>
  successProps?: OtherProps
}) => JSX.Element = (props) => {
  const navigate = useNavigate()
  const location = useLocation()

  createEffect(() => {
    if (props.data.error?.isUnauthenticatedError) {
      setLoginToken(null)
      navigate("/login", {
        replace: true,
        state: { returnTo: [location.pathname, location.search, location.hash].join("") }
      })
    }
  })

  return (
    <ErrorBoundary
      fallback={(error) => {
        console.error(error)
        return <Dynamic component={props.failure || DefaultFailure} error={error} />
      }}
    >
      <Switch>
        <Match when={props.data.loading}>
          <Dynamic component={props.loading || DefaultLoader} />
        </Match>
        <Match when={props.data.error}>
          <Dynamic component={props.failure || DefaultFailure} error={props.data.error} />
        </Match>
        <Match when={true}>
          <Dynamic
            component={props.success}
            data={props.data()!}
            {...(props.successProps as any)}
          />
        </Match>
      </Switch>
    </ErrorBoundary>
  )
}
