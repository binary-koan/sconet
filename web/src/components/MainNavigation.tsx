import { Link, useLocation } from "@solidjs/router"
import {
  TablerIconsProps,
  IconAdjustmentsHorizontal,
  IconChartPie,
  IconInbox,
  IconReportMoney,
  IconPlus
} from "@tabler/icons-solidjs"
import { Component, JSX, Show } from "solid-js"
import { Dynamic } from "solid-js/web"
import logoImage from "../assets/logo.svg"
import { useUnconfirmedTransactionsQuery } from "../graphql/queries/unconfirmedTransactionsQuery"
import { fixAssetPath } from "../utils/fixAssetPath"

const MainNavigation: Component = () => {
  const unconfirmed = useUnconfirmedTransactionsQuery()
  const unconfirmedCount = () => unconfirmed()?.transactions.nodes.length ?? 0

  return (
    <>
      <div class="z-navbar fixed bottom-0 left-0 right-0 h-10 mb-[env(safe-area-inset-bottom)] bg-background backdrop-blur-lg mask-t-from-50% md:hidden" />
      <div class="flex gap-2 z-navbar fixed bottom-2 left-2 right-2 top-auto mb-[env(safe-area-inset-bottom)] md:bottom-auto md:top-2 md:mb-0 md:ml-4">
        <div class="flex-1 flex items-center p-1 md:mx-auto md:max-w-5xl md:px-2 bg-card/60 backdrop-blur-lg rounded-full shadow-sm">
          <Link href="/" class="mr-4 hidden md:block">
            <img class="w-24" src={fixAssetPath(logoImage)} />
          </Link>
          <NavigationItem icon={IconReportMoney} text="History" to="/transactions" />
          <NavigationItem icon={IconInbox} text="Review" to="/review" badge={unconfirmedCount()} />
          <NavigationItem icon={IconChartPie} text="Graphs" to="/graphs" />
          <NavigationItem icon={IconAdjustmentsHorizontal} text="Settings" to="/settings" />
        </div>
      </div>
    </>
  )
}

const NavigationItem: Component<{
  icon: Component<TablerIconsProps>
  text: JSX.Element
  to: string
  badge?: number
}> = (props) => {
  const location = useLocation()

  const isMatch = () => location.pathname.startsWith(props.to)

  return (
    <Link
      href={props.to}
      class="flex flex-1 flex-col items-center py-1 rounded-full transition md:flex-none md:flex-row md:gap-2 md:p-3"
      classList={{ "bg-muted/50 text-primary": isMatch(), "text-muted-foreground": !isMatch() }}
    >
      <span class="relative">
        <Dynamic component={props.icon} class="text-lg" />
        <Show when={props.badge}>
          <span class="absolute -right-0.5 top-0.5 h-2 w-2 rounded-full bg-amber-400" />
        </Show>
      </span>
      <span class="text-xs md:text-base">{props.text}</span>
    </Link>
  )
}

export default MainNavigation
