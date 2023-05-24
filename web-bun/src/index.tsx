import { render } from "solid-js/web";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

render(() => <App />, document.getElementById("root") as HTMLElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
