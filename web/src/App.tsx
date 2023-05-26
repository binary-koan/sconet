import { Navigate, Route, Routes } from "@solidjs/router"
import type { Component, JSX } from "solid-js"
import { Toaster } from "solid-toast"
import { AlertManager } from "./components/AlertManager"
import { MainLayout } from "./components/MainLayout"
import { useRequireLogin } from "./hooks/useRequireLogin"
import { BudgetsRoute } from "./routes/BudgetsRoute"
import { LoginRoute } from "./routes/LoginRoute"
import { SettingsRoute } from "./routes/SettingsRoute"
import { EditAccountRoute } from "./routes/accounts/EditAccountRoute"
import { NewAccountRoute } from "./routes/accounts/NewAccountRoute"
import { EditCategoryRoute } from "./routes/categories/EditCategoryRoute"
import { NewCategoryRoute } from "./routes/categories/NewCategoryRoute"
import { CurrenciesRoute } from "./routes/settings/CurrenciesRoute"
import { ShowTransactionRoute } from "./routes/transactions/ShowTransactionRoute"
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
      <AlertManager />
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
          <ShowTransactionRoute />

          <SettingsRoute />
          <CurrenciesRoute />

          <NewCategoryRoute />
          <EditCategoryRoute />

          <NewAccountRoute />
          <EditAccountRoute />

          <BudgetsRoute />

          <Route
            path="/*all"
            element={
              <div class="flex min-h-[50vh] flex-col items-center justify-center text-center text-gray-600">
                <div class="mb-8 text-7xl">404</div>
                Couldn't find that page.
              </div>
            }
          />
        </LoggedIn>
      </Routes>
    </>
  )
}

export default App
