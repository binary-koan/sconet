import { Box } from "@hope-ui/solid"
import { Routes, Route, Link, Navigate } from "@solidjs/router"
import type { Component } from "solid-js"
import { Toaster } from "solid-toast"
import MainNavigation from "./components/MainNavigation"
import { SettingsRoute } from "./routes/SettingsRoute"
import { TransactionsRoute } from "./routes/TransactionsRoute"

const App: Component = () => {
  return (
    <Box
      maxWidth={{ "@initial": "none", "@lg": "64rem" }}
      margin={{ "@initial": "initial", "@lg": "0 auto" }}
      paddingTop={{ "@initial": "0", "@lg": "4rem" }}
    >
      <Toaster />
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Navigate href="/transactions" />} />

        <TransactionsRoute />
        <SettingsRoute />

        <Route path="/*all" element={<div>Not found</div>} />
      </Routes>
    </Box>
  )
}

export default App
