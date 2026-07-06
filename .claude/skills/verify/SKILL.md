---
name: verify
description: Build and visually verify the sconet web app without the Rails API, using a stub GraphQL server and Playwright screenshots.
---

# Verifying web UI changes

The web frontend (SolidJS + Tailwind v4) can be exercised without the Rails
backend: build it, serve `web/build/` with a stub `/graphql` endpoint, and
drive it with Playwright.

## Build

```bash
cd web && bun install && bun run build   # outputs web/build/
```

`bun typecheck` / `bun lint` have pre-existing failures (solid `on:` event
directives, unused imports) — compare against a clean tree before blaming a
change.

## Serve with a stub API

The client calls same-origin `POST /graphql` and dispatches on
`operationName` (see `web/src/graphql/queries/*.ts` for shapes). A small Bun
server that serves `web/build/` with SPA fallback plus canned responses for
`Transactions`, `CurrentUser`, `UnconfirmedTransactions`, `Categories`,
`Accounts`, `Currencies`, `FavouriteTransactions`, `Budget` covers the main
pages.

Auth: `isLoggedIn()` only base64-decodes the JWT from
`localStorage["sconet.loginToken"]` and checks `exp`, so an unsigned token
(`{alg:"none"}` header, future `exp`, any signature) works. Token refresh
sends a raw `{ currentUser { token } }` query with no operationName.

## Drive with Playwright

`@playwright/test` is a root devDependency; launch with
`executablePath: "/opt/pw-browsers/chromium"`. Use
`browser.newContext({ colorScheme: "dark" })` to test dark mode. Useful
test ids: `transaction-item`, `datepicker-date`, `category-select`,
`account-item`.

Gotcha: full-viewport `page.screenshot()` in headless Chromium can rasterize
freshly-inserted subtrees (e.g. an open dropdown) with the wrong emulated
color scheme — the live DOM is correct. Pass a `clip` to get an accurate
capture before concluding a dark-mode style is broken.
