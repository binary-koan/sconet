import { decodeJwt } from "jose"
import { createSignal } from "solid-js"
import { FullCurrentUserFragment } from "../graphql-types"

const LOGIN_TOKEN_KEY = "sconet.loginToken"
const LAST_USER_EMAIL_KEY = "sconet.userEmail"

const [loginToken, setLoginTokenSignal] = createSignal(localStorage.getItem(LOGIN_TOKEN_KEY))
const [lastUserEmail, setLastUserEmailSignal] = createSignal(
  localStorage.getItem(LAST_USER_EMAIL_KEY)
)

export { loginToken, lastUserEmail }

export function setLoginToken(token: string, email: string): void
export function setLoginToken(token: null): void
export function setLoginToken(token: string | null, email?: string) {
  if (token) {
    setLoginTokenSignal(token)
    localStorage.setItem(LOGIN_TOKEN_KEY, token)

    if (email) {
      setLastUserEmailSignal(email)
      localStorage.setItem(LAST_USER_EMAIL_KEY, email)
    }
  } else {
    setLoginTokenSignal(null)
    localStorage.removeItem(LOGIN_TOKEN_KEY)
  }
}

// Basic check to see if the token is expired. May not work everywhere, so we also check in places like <Cell>
export function isLoggedIn() {
  const token = loginToken()

  if (!token) return false

  const payload = decodeJwt(token)

  return payload.exp && payload.exp > Date.now() / 1000
}
