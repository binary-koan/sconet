/* @refresh reload */
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import "solid-devtools"
import { render } from "solid-js/web"

import App from "./App"
import "./index.css"

render(
  () => (
    <MetaProvider>
      <Router>
        <App />
      </Router>
    </MetaProvider>
  ),
  document.getElementById("root") as HTMLElement
)
