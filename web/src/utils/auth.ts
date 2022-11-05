import { decodeJwt } from "jose"
import { createSignal } from "solid-js"

const LOGIN_TOKEN_KEY = "sconet.loginToken"

const [loginToken, setLoginTokenSignal] = createSignal(localStorage.getItem(LOGIN_TOKEN_KEY))

export { loginToken }

export function setLoginToken(token: string | null) {
  if (token) {
    setLoginTokenSignal(token)
    localStorage.setItem(LOGIN_TOKEN_KEY, token)
  } else {
    setLoginTokenSignal(null)
    localStorage.removeItem(LOGIN_TOKEN_KEY)
  }
}

export function isLoggedIn() {
  const token = loginToken()

  if (!token) return false

  const payload = decodeJwt(token)

  return payload.exp && payload.exp > Date.now() / 1000
}
