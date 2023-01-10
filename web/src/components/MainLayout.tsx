import { Outlet } from "@solidjs/router"
import { Component } from "solid-js"
import MainNavigation from "./MainNavigation"

export const MainLayout: Component = () => {
  return (
    <div class="flex min-h-screen flex-col pb-24 lg:mx-auto lg:max-w-5xl lg:pt-14">
      <MainNavigation />
      <Outlet />
    </div>
  )
}
