import { Box, Heading, Text } from "@hope-ui/solid"
import { useMatch, Link } from "@solidjs/router"
import { Component, JSX } from "solid-js"
import { TbAdjustmentsHorizontal, TbChartPie, TbReportMoney } from "solid-icons/tb"
import { IconProps } from "solid-icons"
import { Dynamic } from "solid-js/web"

const MainNavigation: Component = () => {
  return (
    <Box
      background="$neutral1"
      position="fixed"
      zIndex="sticky"
      bottom={{ "@initial": "0", "@lg": "auto" }}
      top={{ "@initial": "auto", "@lg": "0" }}
      left="0"
      right="0"
      paddingLeft={{ "@initial": "0", "@lg": "$4" }}
      boxShadow={{ "@initial": "$lg", "@lg": "$sm" }}
      paddingBottom={{ "@initial": "env(safe-area-inset-bottom)", "@lg": "0" }}
    >
      <Box
        maxWidth={{ "@initial": "none", "@lg": "64rem" }}
        margin={{ "@initial": "initial", "@lg": "0 auto" }}
        paddingStart={{ "@initial": "0", "@lg": "$2" }}
        paddingEnd={{ "@initial": "0", "@lg": "$2" }}
        display="flex"
        alignItems="center"
      >
        <Heading display={{ "@initial": "none", "@lg": "block" }} marginEnd="$4" size="sm">
          Sconet
        </Heading>
        <NavigationItem icon={TbReportMoney} text="History" to="/transactions" />
        <NavigationItem icon={TbChartPie} text="Budgets" to="/budgets" />
        <NavigationItem icon={TbAdjustmentsHorizontal} text="Settings" to="/settings" />
      </Box>
    </Box>
  )
}

const NavigationItem: Component<{ icon: Component<IconProps>; text: JSX.Element; to: string }> = (
  props
) => {
  const match = useMatch(() => props.to)

  return (
    <Box as={Link} href={props.to} flex={{ "@initial": 1, "@lg": 0 }}>
      <Box
        display="flex"
        flexDirection={{ "@initial": "column", "@lg": "row" }}
        alignItems="center"
        gap={{ "@initial": "$1", "@lg": "$2" }}
        paddingBottom={{ "@initial": "$2", "@lg": "$4" }}
        paddingTop={{ "@initial": "$2", "@lg": "$4" }}
        paddingStart={{ "@initial": "0", "@lg": "$6" }}
        paddingEnd={{ "@initial": "0", "@lg": "$6" }}
        color={match() ? "$primary9" : "$neutral9"}
      >
        <Dynamic component={props.icon} size="1.5em" />
        <Text fontSize={{ "@initial": "$xs", "@lg": "$medium" }}>{props.text}</Text>
      </Box>
    </Box>
  )
}

export default MainNavigation
