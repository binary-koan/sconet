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
import { TransactionsCalendarRoute } from "./routes/TransactionsCalendarRoute"
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
  const currentYearMonth = () =>
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`

  return (
    <div class="flex min-h-screen flex-col lg:mx-auto lg:max-w-5xl lg:pt-16">
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
          <SettingsRoute />
          <NewCategoryRoute />
          <EditCategoryRoute />
          <NewAccountMailboxRoute />
          <Route path="/budgets" element={<Navigate href={`/budgets/${currentYearMonth()}`} />} />
          <BudgetsRoute />

          <Route path="/*all" element={<div>Not found</div>} />
        </LoggedIn>
      </Routes>
    </div>
  )
}

export default App
