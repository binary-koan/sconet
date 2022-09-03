import { Component, Resource, Switch, Match, JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"

export const Cell: <Data, OtherProps = {}>(
  props: OtherProps & {
    data: Resource<Data>
    loading?: Component
    failure?: Component<{ error: any }>
    success: Component<OtherProps & { data: Data }>
  }
) => JSX.Element = (allProps) => {
  const [props, otherProps] = splitProps(allProps, ["data", "loading", "failure", "success"])

  return (
    <Switch>
      <Match
        when={
          props.loading && (props.data.state === "unresolved" || props.data.state === "pending")
        }
      >
        <Dynamic component={props.loading} />
      </Match>
      <Match when={props.failure && props.data.state === "errored"}>
        <Dynamic component={props.failure} error={props.data.error} />
      </Match>
      <Match when={true}>
        <Dynamic component={props.success} data={props.data()} {...(otherProps as any)} />
      </Match>
    </Switch>
  )
}
