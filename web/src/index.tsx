import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import "solid-devtools";
import { render } from "solid-js/web";

import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

render(
  () => (
    <MetaProvider>
      <Router>
        <App />
      </Router>
    </MetaProvider>
  ),
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
