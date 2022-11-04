import { decodeJwt } from "jose"

const LOGIN_TOKEN_KEY = "sconet.loginToken"

export const loginToken = () => localStorage.getItem(LOGIN_TOKEN_KEY)

export function setLoginToken(token: string) {
  localStorage.setItem(LOGIN_TOKEN_KEY, token)
}

export function isLoggedIn() {
  const token = loginToken()

  if (!token) return false

  const payload = decodeJwt(token)

  return payload.exp && payload.exp > Date.now() / 1000
}
