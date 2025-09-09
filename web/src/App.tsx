import { Navigate, Route, Routes } from "@solidjs/router"
import type { Component, JSX } from "solid-js"
import { Toaster } from "solid-toast"
import { AlertManager } from "./components/AlertManager.tsx"
import { MainLayout } from "./components/MainLayout.tsx"
import { useRequireLogin } from "./hooks/useRequireLogin.ts"
import { LoginRoute } from "./routes/LoginRoute.tsx"
import { SettingsRoute } from "./routes/SettingsRoute.tsx"
import { EditAccountRoute } from "./routes/accounts/EditAccountRoute.tsx"
import { NewAccountRoute } from "./routes/accounts/NewAccountRoute.tsx"
import { EditCategoryRoute } from "./routes/categories/EditCategoryRoute.tsx"
import { NewCategoryRoute } from "./routes/categories/NewCategoryRoute.tsx"
import { BalanceRoute } from "./routes/graphs/BalanceRoute.tsx"
import { BudgetsRoute } from "./routes/graphs/BudgetsRoute.tsx"
import { CurrenciesRoute } from "./routes/settings/CurrenciesRoute.tsx"
import { ShowTransactionRoute } from "./routes/transactions/ShowTransactionRoute.tsx"
import { TransactionsCalendarRoute } from "./routes/transactions/TransactionsCalendarRoute.tsx"
import { TransactionsListRoute } from "./routes/transactions/TransactionsListRoute.tsx"
import { transactionsViewPreference } from "./utils/transactions/viewPreference.ts"

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

          <Route path="/graphs" element={<Navigate href="/graphs/budgets" />} />
          <BudgetsRoute />
          <BalanceRoute />

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
