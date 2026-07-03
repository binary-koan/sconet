import { Link, useLocation } from "@solidjs/router"
import {
  TablerIconsProps,
  IconAdjustmentsHorizontal,
  IconChartPie,
  IconInbox,
  IconPlus,
  IconReportMoney
} from "@tabler/icons-solidjs"
import { Component, JSX, Show, createSignal } from "solid-js"
import { Dynamic } from "solid-js/web"
import logoImage from "../assets/logo.svg"
import { useUnconfirmedTransactionsQuery } from "../graphql/queries/unconfirmedTransactionsQuery"
import { fixAssetPath } from "../utils/fixAssetPath"
import { NewTransactionModal } from "./transactions/NewTransactionModal"

const MainNavigation: Component = () => {
  const unconfirmed = useUnconfirmedTransactionsQuery()
  const unconfirmedCount = () => unconfirmed()?.transactions.nodes.length ?? 0
  const [creatingTransaction, setCreatingTransaction] = createSignal(false)

  return (
    <div class="z-navbar fixed bottom-0 left-0 right-0 top-auto bg-white pb-[env(safe-area-inset-bottom)] shadow-sm md:bottom-auto md:top-0 md:pb-0 md:pl-4">
      <div class="flex items-center md:mx-auto md:max-w-5xl md:px-2">
        <Link href="/" class="mr-4 hidden md:block">
          <img class="w-24" src={fixAssetPath(logoImage)} />
        </Link>
        <NavigationItem icon={IconReportMoney} text="History" to="/transactions" />
        <NavigationItem icon={IconInbox} text="Review" to="/review" badge={unconfirmedCount()} />
        <NavigationItem icon={IconChartPie} text="Graphs" to="/graphs" />
        <NavigationItem icon={IconAdjustmentsHorizontal} text="Settings" to="/settings" />
        <button
          class="ml-auto hidden items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-indigo-600 md:flex"
          onClick={() => setCreatingTransaction(true)}
        >
          <IconPlus size="1.25em" class="-ml-1 mr-2" />
          Add
        </button>
      </div>
      <Show when={creatingTransaction()}>
        <NewTransactionModal isOpen={true} onClose={() => setCreatingTransaction(false)} />
      </Show>
    </div>
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
      class="flex flex-1 flex-col items-center gap-1 py-2 md:flex-none md:flex-row md:gap-2 md:px-3 md:py-4"
      classList={{ "text-indigo-600": isMatch(), "text-gray-600": !isMatch() }}
    >
      <span class="relative">
        <Dynamic component={props.icon} size="1.5em" />
        <Show when={props.badge}>
          <span class="absolute -right-2 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.65rem] font-semibold leading-none text-white">
            {props.badge}
          </span>
        </Show>
      </span>
      <span class="text-xs md:text-base">{props.text}</span>
    </Link>
  )
}

export default MainNavigation
