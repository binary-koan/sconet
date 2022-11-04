import { decodeJwt } from "jose"
import { createSignal } from "solid-js"

const LOGIN_TOKEN_KEY = "sconet.loginToken"

export const [loginToken, setLoginTokenSignal] = createSignal(localStorage.getItem(LOGIN_TOKEN_KEY))

export function setLoginToken(token: string) {
  setLoginTokenSignal(token)
  localStorage.setItem(LOGIN_TOKEN_KEY, token)
}

export function isLoggedIn() {
  const token = loginToken()

  if (!token) return false

  const payload = decodeJwt(token)

  return payload.exp && payload.exp > Date.now() / 1000
}
