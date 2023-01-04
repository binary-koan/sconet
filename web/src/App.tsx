import { Navigate, Route, Routes } from "@solidjs/router"
import type { Component, JSX } from "solid-js"
import { Toaster } from "solid-toast"
import { MainLayout } from "./components/MainLayout"
import { useRequireLogin } from "./hooks/useRequireLogin"
import { NewAccountMailboxRoute } from "./routes/accountMailboxes/NewAccountMailboxRoute"
import { BudgetsRoute } from "./routes/BudgetsRoute"
import { EditCategoryRoute } from "./routes/categories/EditCategoryRoute"
import { NewCategoryRoute } from "./routes/categories/NewCategoryRoute"
import { LoginRoute } from "./routes/LoginRoute"
import { SettingsRoute } from "./routes/SettingsRoute"
import { EditTransactionRoute } from "./routes/transactions/EditTransactionRoute"
import { NewTransactionRoute } from "./routes/transactions/NewTransactionRoute"
import { TransactionsCalendarRoute } from "./routes/transactions/TransactionsCalendarRoute"
import { TransactionsListRoute } from "./routes/transactions/TransactionsListRoute"
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
  const currentYearMonth = () =>
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route
          path="/"
          element={<Navigate href={`/transactions/${transactionsViewPreference()}`} />}
        />

        <LoginRoute />

        <LoggedIn>
          <Route
            path="/transactions"
            element={<Navigate href={`/transactions/${transactionsViewPreference()}`} />}
          />
          <Route
            path="/transactions/calendar"
            element={<Navigate href={`/transactions/calendar/${currentYearMonth()}`} />}
          />

          <TransactionsListRoute />
          <TransactionsCalendarRoute />
          <NewTransactionRoute />
          <EditTransactionRoute />

          <SettingsRoute />

          <NewCategoryRoute />
          <EditCategoryRoute />

          <NewAccountMailboxRoute />

          <BudgetsRoute />

          <Route path="/*all" element={<div>Not found</div>} />
        </LoggedIn>
      </Routes>
    </>
  )
}

export default App
