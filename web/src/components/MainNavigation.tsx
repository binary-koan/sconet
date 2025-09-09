import { Link, useLocation } from "@solidjs/router"
import {
  TablerIconsProps,
  IconAdjustmentsHorizontal,
  IconChartPie,
  IconReportMoney
} from "@tabler/icons-solidjs"
import { Component, JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import logoImage from "../assets/logo.svg"
import { fixAssetPath } from "../utils/fixAssetPath.ts"

const MainNavigation: Component = () => {
  return (
    <div class="z-navbar fixed bottom-0 left-0 right-0 top-auto bg-white pb-[env(safe-area-inset-bottom)] shadow md:bottom-auto md:top-0 md:pb-0 md:pl-4">
      <div class="flex items-center md:mx-auto md:max-w-5xl md:px-2">
        <Link href="/" class="mr-4 hidden md:block">
          <img class="w-24" src={fixAssetPath(logoImage)} />
        </Link>
        <NavigationItem icon={IconReportMoney} text="History" to="/transactions" />
        <NavigationItem icon={IconChartPie} text="Graphs" to="/graphs" />
        <NavigationItem icon={IconAdjustmentsHorizontal} text="Settings" to="/settings" />
      </div>
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
      class="flex flex-1 flex-col items-center gap-1 py-2 md:flex-none md:flex-row md:gap-2 md:px-3 md:py-4"
      classList={{ "text-indigo-600": isMatch(), "text-gray-600": !isMatch() }}
    >
      <Dynamic component={props.icon} size="1.5em" />
      <span class="text-xs md:text-base">{props.text}</span>
    </Link>
  )
}

export default MainNavigation
