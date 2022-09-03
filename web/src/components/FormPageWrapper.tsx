import { Heading, Button, Icon, Box } from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { TbArrowLeft } from "solid-icons/tb"
import { JSX } from "solid-js"

const FormPageWrapper = ({
  heading,
  backLink,
  children,
  actions
}: {
  heading: JSX.Element
  backLink: string
  children: JSX.Element
  actions?: JSX.Element
}) => {
  return (
    <>
      <Heading
        fontSize={{ "@initial": "$lg", "@lg": "$3xl" }}
        paddingStart="$4"
        paddingEnd="$4"
        marginTop={{ "@initial": "$2", "@lg": "$4" }}
        marginBottom={{ "@initial": "$2", "@lg": "$4" }}
        display="flex"
        alignItems="center"
      >
        <Button as={Link} href={backLink} variant="ghost" paddingLeft="0">
          <Icon as={TbArrowLeft} />
        </Button>
        {heading}
        {actions && <Box marginLeft="auto">{actions}</Box>}
      </Heading>
      <Box padding={{ "@initial": "$4", "@lg": "$6" }} backgroundColor="$neutral1" boxShadow="xs">
        {children}
      </Box>
    </>
  )
}

export default FormPageWrapper
