import { decodeJwt } from "jose"
import { createSignal } from "solid-js"

const LOGIN_TOKEN_KEY = "sconet.loginToken"
const LAST_USER_ID_KEY = "sconet.userId"

const [loginToken, setLoginTokenSignal] = createSignal(localStorage.getItem(LOGIN_TOKEN_KEY))
const [lastUserId, setLastUserIdSignal] = createSignal(localStorage.getItem(LAST_USER_ID_KEY))

export { loginToken, lastUserId }

export function setLoginToken(token: string | null) {
  if (token) {
    setLoginTokenSignal(token)
    localStorage.setItem(LOGIN_TOKEN_KEY, token)

    const userId = decodeJwt(token).sub!
    setLastUserIdSignal(userId)
    localStorage.setItem(LAST_USER_ID_KEY, userId)
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
