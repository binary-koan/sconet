import { Link, useLocation } from "@solidjs/router"
import { TablerIconsProps, IconCalendarStats, IconChartLine } from "@tabler/icons-solidjs"
import { Component, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"

export const GraphsNavigation: Component = () => {
  return (
    <div class="mb-4 flex md:mt-3 md:px-4">
      <NavigationItem icon={IconCalendarStats} text="Budgets" to="/graphs/budgets" />
      <NavigationItem icon={IconChartLine} text="Balance" to="/graphs/balance" />
    </div>
  )
}

const NavigationItem: Component<{
  icon: Component<TablerIconsProps>
  text: JSX.Element
  to: string
}> = (props) => {
  const location = useLocation()

  const isMatch = () => location.pathname.startsWith(props.to)

  return (
    <Link
      href={props.to}
      class="flex flex-1 flex-row items-center justify-center gap-1 border-b-2 py-4 md:py-3"
      classList={{
        "text-indigo-600 border-indigo-600": isMatch(),
        "text-gray-600 border-gray-200": !isMatch()
      }}
    >
      <Dynamic component={props.icon} size="1.5em" />
      <span class="text-xs md:text-base">{props.text}</span>
    </Link>
  )
}
