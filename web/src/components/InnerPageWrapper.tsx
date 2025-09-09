import { IconArrowLeft } from "@tabler/icons-solidjs"
import { Component, JSX, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { LinkButton } from "./base/Button.tsx"
import { PageHeader } from "./base/PageHeader.tsx"

const InnerPageWrapper: Component<{
  heading: JSX.Element
  backLink: string
  children: JSX.Element
  actions?: JSX.Element
  contentBackground?: boolean
}> = (props) => {
  return (
    <>
      <PageHeader size="lg">
        <LinkButton href={props.backLink} variant="ghost" colorScheme="primary" class="-ml-4 mr-2">
          <Dynamic component={IconArrowLeft} />
        </LinkButton>
        {props.heading}
        <Show when={props.actions}>
          <div class="ml-auto">{props.actions}</div>
        </Show>
      </PageHeader>
      <div
        classList={{
          "p-4 shadow-sm lg:rounded lg:p-6 bg-white": props.contentBackground !== false
        }}
      >
        {props.children}
      </div>
    </>
  )
}

export default InnerPageWrapper
