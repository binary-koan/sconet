import { Box } from "@hope-ui/solid"
import { Routes, Route, Navigate } from "@solidjs/router"
import type { Component, JSX } from "solid-js"
import { Toaster } from "solid-toast"
import { MainLayout } from "./components/MainLayout"
import { useRequireLogin } from "./hooks/useRequireLogin"
import { BudgetsRoute } from "./routes/BudgetsRoute"
import { EditCategoryRoute } from "./routes/categories/EditCategoryRoute"
import { LoginRoute } from "./routes/LoginRoute"
import { NewAccountMailboxRoute } from "./routes/NewAccountMailboxRoute"
import { NewCategoryRoute } from "./routes/NewCategoryRoute"
import { NewTransactionRoute } from "./routes/NewTransactionRoute"
import { SettingsRoute } from "./routes/SettingsRoute"
import { TransactionsRoute } from "./routes/TransactionsRoute"

const LoggedIn: Component<{ children: JSX.Element }> = (props) => {
  useRequireLogin()

  return (
    <Route path="/" component={MainLayout}>
      {props.children}
    </Route>
  )
}

const App: Component = () => {
  return (
    <Box
      maxWidth={{ "@initial": "none", "@lg": "64rem" }}
      margin={{ "@initial": "initial", "@lg": "0 auto" }}
      paddingTop={{ "@initial": "0", "@lg": "4rem" }}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate href="/transactions" />} />

        <LoginRoute />

        <LoggedIn>
          <TransactionsRoute />
          <NewTransactionRoute />
          <SettingsRoute />
          <NewCategoryRoute />
          <EditCategoryRoute />
          <NewAccountMailboxRoute />
          <BudgetsRoute />

          <Route path="/*all" element={<div>Not found</div>} />
        </LoggedIn>
      </Routes>
    </Box>
  )
}

export default App
