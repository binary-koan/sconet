/* @refresh reload */
import "solid-devtools"
import { HopeProvider } from "@hope-ui/solid"
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"

import App from "./App"
import { theme } from "./utils/theme"

render(
  () => (
    <MetaProvider>
      <HopeProvider config={theme}>
        <Router>
          <App />
        </Router>
      </HopeProvider>
    </MetaProvider>
  ),
  document.getElementById("root") as HTMLElement
)
