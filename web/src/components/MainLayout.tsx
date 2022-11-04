import { Outlet } from "@solidjs/router"
import { Component } from "solid-js"
import MainNavigation from "./MainNavigation"

export const MainLayout: Component = () => {
  return (
    <>
      <MainNavigation />
      <Outlet />
    </>
  )
}
