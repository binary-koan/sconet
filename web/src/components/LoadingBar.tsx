import { Progress, ProgressIndicator } from "@hope-ui/solid"

const LoadingBar = () => {
  return (
    <Progress indeterminate size="xs">
      <ProgressIndicator />
    </Progress>
  )
}

export default LoadingBar
