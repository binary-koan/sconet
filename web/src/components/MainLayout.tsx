import { Outlet } from "@solidjs/router"
import { Component } from "solid-js"
import MainNavigation from "./MainNavigation"

export const MainLayout: Component = () => {
  return (
    <div class="flex h-dvh flex-col overflow-y-auto pb-20 md:mx-auto md:max-w-5xl md:pt-14">
      <MainNavigation />
      <Outlet />
    </div>
  )
}
