import { Outlet } from "@solidjs/router"
import { Component } from "solid-js"
import MainNavigation from "./MainNavigation.tsx"

export const MainLayout: Component = () => {
  return (
    <div class="flex min-h-screen flex-col pb-24 md:mx-auto md:max-w-5xl md:pt-14">
      <MainNavigation />
      <Outlet />
    </div>
  )
}
