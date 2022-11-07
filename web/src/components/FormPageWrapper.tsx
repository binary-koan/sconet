import { TbArrowLeft } from "solid-icons/tb"
import { Component, JSX, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import { LinkButton } from "./base/Button"
import { Heading1 } from "./base/Heading"

const FormPageWrapper: Component<{
  heading: JSX.Element
  backLink: string
  children: JSX.Element
  actions?: JSX.Element
}> = (props) => {
  return (
    <>
      <Heading1 size="lg">
        <LinkButton href={props.backLink} variant="ghost" colorScheme="primary" class="-ml-4 mr-2">
          <Dynamic component={TbArrowLeft} />
        </LinkButton>
        {props.heading}
        <Show when={props.actions}>
          <div class="ml-auto">{props.actions}</div>
        </Show>
      </Heading1>
      <div class="bg-white p-4 shadow-sm lg:rounded lg:p-6">{props.children}</div>
    </>
  )
}

export default FormPageWrapper
