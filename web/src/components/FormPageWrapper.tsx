import { Heading, Button, Icon, Box } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { TbArrowLeft } from "solid-icons/tb"
import { Component, JSX, Show } from "solid-js"
import { Dynamic } from "solid-js/web"

const FormPageWrapper: Component<{
  heading: JSX.Element
  backLink: string
  children: JSX.Element
  actions?: JSX.Element
}> = (props) => {
  return (
    <>
      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$2xl" }}
        paddingStart="$4"
        paddingEnd="$4"
        marginTop={{ "@initial": "$2", "@lg": "$4" }}
        marginBottom={{ "@initial": "$2", "@lg": "$4" }}
        display="flex"
        alignItems="center"
      >
        <Button as={Link} href={props.backLink} variant="ghost" paddingLeft="0">
          <Dynamic component={TbArrowLeft} />
        </Button>
        {props.heading}
        <Show when={props.actions}>
          <Box marginLeft="auto">{props.actions}</Box>
        </Show>
      </Heading>
      <Box padding={{ "@initial": "$4", "@lg": "$6" }} backgroundColor="$neutral1" boxShadow="$xs">
        {props.children}
      </Box>
    </>
  )
}

export default FormPageWrapper
