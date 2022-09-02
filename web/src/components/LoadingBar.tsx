import { Progress, ProgressIndicator } from "@hope-ui/solid"
import { Component } from "solid-js"

const LoadingBar: Component = () => {
  return (
    <Progress indeterminate size="xs">
      <ProgressIndicator />
    </Progress>
  )
}

export default LoadingBar
