import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import "solid-devtools";
import { render } from "solid-js/web";

import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { initPullToRefresh } from "./utils/pullToRefresh";

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

// ponytail: reload-on-foreground beats a service worker; the JS hash in
// index.html changes every build, so a mismatch means a new deploy.
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState !== "visible") return;
  try {
    const html = await (await fetch("/", { cache: "no-store" })).text();
    const latestJs = html.match(/src="(\/index-\w+\.js)"/)?.[1];
    const currentJs = document
      .querySelector<HTMLScriptElement>("script[src^='/index-']")
      ?.getAttribute("src");
    if (latestJs && currentJs && latestJs !== currentJs) {
      window.location.reload();
    }
  } catch {
    // offline etc — try again next foreground
  }
});

initPullToRefresh();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
