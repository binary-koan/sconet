import { Alert } from "@hope-ui/solid"
import { Component, Resource, Switch, Match, JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import LoadingBar from "./LoadingBar"

const DefaultLoader = () => <LoadingBar />
const DefaultFailure: Component<{ error: any }> = (props) => (
  <Alert status="danger">{props.error.message}</Alert>
)

export const Cell: <Data, OtherProps = never>(props: {
  data: Resource<Data>
  loading?: Component
  failure?: Component<{ error: any }>
  success: Component<{ data: Data } & OtherProps>
  successProps?: OtherProps
}) => JSX.Element = (allProps) => {
  const [props, otherProps] = splitProps(allProps, ["data", "loading", "failure", "success"])

  return (
    <Switch>
      <Match when={props.data.state === "unresolved" || props.data.state === "pending"}>
        <Dynamic component={props.loading || DefaultLoader} />
      </Match>
      <Match when={props.failure && props.data.state === "errored"}>
        <Dynamic component={props.failure || DefaultFailure} error={props.data.error} />
      </Match>
      <Match when={true}>
        <Dynamic component={props.success} data={props.data()} {...(otherProps as any)} />
      </Match>
    </Switch>
  )
}
