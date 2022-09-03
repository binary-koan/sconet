/* @refresh reload */
import { HopeProvider } from "@hope-ui/solid"
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"

import App from "./App"

render(
  () => (
    <MetaProvider>
      <HopeProvider>
        <Router>
          <App />
        </Router>
      </HopeProvider>
    </MetaProvider>
  ),
  document.getElementById("root") as HTMLElement
)
