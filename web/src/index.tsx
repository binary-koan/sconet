/* @refresh reload */
import { HopeProvider } from "@hope-ui/solid"
import { Router } from "@solidjs/router"
import { render } from "solid-js/web"

import App from "./App"

render(
  () => (
    <HopeProvider>
      <Router>
        <App />
      </Router>
    </HopeProvider>
  ),
  document.getElementById("root") as HTMLElement
)
