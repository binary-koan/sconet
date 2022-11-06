import { Box } from "@hope-ui/solid"
import { Navigate, Route, Routes } from "@solidjs/router"
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
import { TransactionsListRoute } from "./routes/TransactionsListRoute"
import { transactionsViewPreference } from "./utils/transactions/viewPreference"

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
        <Route
          path="/"
          element={<Navigate href={`/transactions/${transactionsViewPreference()}`} />}
        />
        <Route
          path="/transactions"
          element={<Navigate href={`/transactions/${transactionsViewPreference()}`} />}
        />

        <LoginRoute />

        <LoggedIn>
          <TransactionsListRoute />
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
