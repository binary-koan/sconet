import { Box } from "@hope-ui/solid"
import { Routes, Route, Link, Navigate } from "@solidjs/router"
import type { Component } from "solid-js"
import { Toaster } from "solid-toast"
import MainNavigation from "./components/MainNavigation"
import { EditCategoryRoute } from "./routes/EditCategoryRoute"
import { NewAccountMailboxRoute } from "./routes/NewAccountMailboxRoute"
import { NewCategoryRoute } from "./routes/NewCategoryRoute"
import { NewTransactionRoute } from "./routes/NewTransactionRoute"
import { SettingsRoute } from "./routes/SettingsRoute"
import { TransactionsRoute } from "./routes/TransactionsRoute"

const App: Component = () => {
  return (
    <Box
      maxWidth={{ "@initial": "none", "@lg": "64rem" }}
      margin={{ "@initial": "initial", "@lg": "0 auto" }}
      paddingTop={{ "@initial": "0", "@lg": "4rem" }}
    >
      <Toaster position="top-center" />
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Navigate href="/transactions" />} />

        <TransactionsRoute />
        <NewTransactionRoute />
        <SettingsRoute />
        <NewCategoryRoute />
        <EditCategoryRoute />
        <NewAccountMailboxRoute />

        <Route path="/*all" element={<div>Not found</div>} />
      </Routes>
    </Box>
  )
}

export default App
