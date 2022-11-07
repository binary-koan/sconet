import { Link, useLocation } from "@solidjs/router"
import { IconProps } from "solid-icons"
import { TbAdjustmentsHorizontal, TbChartPie, TbReportMoney } from "solid-icons/tb"
import { Component, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"

const MainNavigation: Component = () => {
  return (
    <div class="z-navbar fixed bottom-0 top-auto left-0 right-0 bg-white pb-[env(safe-area-inset-bottom)] shadow lg:bottom-auto lg:top-0 lg:pl-4 lg:pb-0">
      <div class="flex items-center lg:mx-auto lg:max-w-5xl lg:px-2">
        <div class="mr-4 hidden text-lg font-semibold lg:block">Sconet</div>
        <NavigationItem icon={TbReportMoney} text="History" to="/transactions" />
        <NavigationItem icon={TbChartPie} text="Budgets" to="/budgets" />
        <NavigationItem icon={TbAdjustmentsHorizontal} text="Settings" to="/settings" />
      </div>
    </div>
  )
}

const NavigationItem: Component<{ icon: Component<IconProps>; text: JSX.Element; to: string }> = (
  props
) => {
  const location = useLocation()

  const isMatch = () => location.pathname.startsWith(props.to)

  return (
    <Link
      href={props.to}
      class="flex flex-1 flex-col items-center gap-1 py-2 lg:flex-none lg:flex-row lg:gap-2 lg:py-4 lg:px-3"
      classList={{ "text-indigo-600": isMatch(), "text-gray-600": !isMatch() }}
    >
      <Dynamic component={props.icon} size="1.5em" />
      <span class="text-xs lg:text-base">{props.text}</span>
    </Link>
  )
}

export default MainNavigation
