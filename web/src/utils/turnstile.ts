import { createSignal } from "solid-js"

declare global {
  interface Window {
    onloadTurnstile: () => void
    turnstile?: Turnstile
  }
}

// Copied from https://github.com/marsidev/react-turnstile/blob/main/src/types.d.ts
interface Turnstile {
  /**
   * Method to explicit render a widget.
   * @param container -  Element ID or HTML node element.
   * @param params -  Optional. Render parameter options. See {@link https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#configurations the docs} for more info about this options.
   * @returns The rendered widget ID.
   */
  render: (container?: string | HTMLElement, params?: RenderOptions) => string | undefined
  /**
   * Method to reset a widget.
   * @param id -  Optional. ID of the widget to reset, if not provided will target the last rendered widget.
   */
  reset: (id?: string) => void
  /**
   * Method to remove a widget.
   * @param id -  Optional. ID of the widget to remove, if not provided will target the last rendered widget.
   */
  remove: (id?: string) => void
  /**
   * Method to get the token of a widget.
   * @param id -  Optional. ID of the widget to get the token from, if not provided will target the last rendered widget.
   * @returns The token response.
   */
  getResponse: (id?: string) => string | undefined
}

interface RenderOptions {
  /**
   * The sitekey of your widget. This sitekey is created upon the widget creation.
   */
  sitekey: string
  /**
   * A customer value that can be used to differentiate widgets under the same sitekey in analytics and which is returned upon validation. This can only contain up to 32 alphanumeric characters including _ and -.
   * @default undefined
   */
  action?: string
  /**
   * A customer payload that can be used to attach customer data to the challenge throughout its issuance and which is returned upon validation. This can only contain up to 255 alphanumeric characters including _ and -.
   * @default undefined
   */
  cData?: string
  /**
   * Callback that is invoked upon success of the challenge. The callback is passed a token that can be validated.
   * @param token - Token response.
   */
  callback?: (token: string) => void
  /**
   * Callback that is invoked when a challenge expires.
   */
  "expired-callback"?: () => void
  /**
   * Callback that is invoked when there is a network error.
   */
  "error-callback"?: () => void
  /**
   * The widget theme. This can be forced to light or dark by setting the theme accordingly.
   *
   * @default `auto`
   */
  theme?: "light" | "dark" | "auto"
  /**
   * The tabindex of Turnstile’s iframe for accessibility purposes.
   * @default 0
   */
  tabindex?: number
  /**
   * A boolean that controls if an input element with the response token is created.
   * @default true
   */
  "response-field"?: boolean
  /**
   * Name of the input element.
   * @default `cf-turnstile-response`
   */
  "response-field-name"?: string
  /**
   * The widget size. Can take the following values: `normal`, `compact`. The normal size is 300x65px, the compact size is 130x120px.
   * @default `normal`
   */
  size?: "normal" | "compact"
  /**
   * Controls whether the widget should automatically retry to obtain a token if it did not succeed. The default is `'auto'`, which will retry automatically. This can be set to `'never'` to disable retry upon failure.
   * @default `auto`
   */
  retry?: "auto" | "never"
  /**
   * When `retry` is set to `'auto'`, `retry-interval` controls the time between retry attempts in milliseconds. The value must be a positive integer less than `900000`. When `retry` is set to `'never'`, this parameter has no effect.
   * @default 8000
   */
  "retry-interval"?: number
}

const [turnstileLoaded, setTurnstileLoaded] = createSignal(false)
const [turnstileError, setTurnstileError] = createSignal<string | undefined>(undefined)

export { turnstileLoaded, turnstileError }

export const loadTurnstile = () => {
  if (turnstileLoaded()) return

  const script = document.createElement("script")
  script.type = "text/javascript"
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

  script.addEventListener("load", () => setTurnstileLoaded(true))
  script.addEventListener("error", (error) =>
    setTurnstileError(error.message || "Unknown error loading script")
  )

  document.body.appendChild(script)
}
