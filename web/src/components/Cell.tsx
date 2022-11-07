import { Component, ErrorBoundary, JSX, Match, Resource, Switch } from "solid-js"
import { Dynamic } from "solid-js/web"
import LoadingBar from "./LoadingBar"

const DefaultLoader = () => <LoadingBar />
const DefaultFailure: Component<{ error: any }> = (props) => (
  <div class="rounded bg-red-100 p-4 text-red-700">{props.error.message}</div>
)

export const Cell: <Data, OtherProps = never>(props: {
  data: Resource<Data>
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
        <Match when={props.data.state === "unresolved" || props.data.state === "pending"}>
          <Dynamic component={props.loading || DefaultLoader} />
        </Match>
        <Match when={props.failure && props.data.state === "errored"}>
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
