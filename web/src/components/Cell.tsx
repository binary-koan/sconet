import { Component, ErrorBoundary, JSX, Match, Switch } from "solid-js"
import { Dynamic } from "solid-js/web"
import { QueryResource } from "../utils/graphqlClient/useQuery"
import LoadingBar from "./LoadingBar"

const DefaultLoader = () => <LoadingBar />
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
        <Match when={props.failure && props.data.error}>
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
