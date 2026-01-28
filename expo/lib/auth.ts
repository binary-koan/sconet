import AsyncStorage from "@react-native-async-storage/async-storage"
import { jwtDecode } from "jwt-decode"

const LOGIN_TOKEN_KEY = "sconet.loginToken"
const LAST_USER_EMAIL_KEY = "sconet.userEmail"

interface JwtPayload {
  user_id: number
  exp: number
}

let cachedToken: string | null = null

export async function getLoginToken(): Promise<string | null> {
  if (cachedToken !== null) return cachedToken
  cachedToken = await AsyncStorage.getItem(LOGIN_TOKEN_KEY)
  return cachedToken
}

export async function setLoginToken(token: string | null, email?: string): Promise<void> {
  cachedToken = token
  if (token) {
    await AsyncStorage.setItem(LOGIN_TOKEN_KEY, token)
    if (email) {
      await AsyncStorage.setItem(LAST_USER_EMAIL_KEY, email)
    }
  } else {
    await AsyncStorage.removeItem(LOGIN_TOKEN_KEY)
  }
}

export async function getLastUserEmail(): Promise<string | null> {
  return AsyncStorage.getItem(LAST_USER_EMAIL_KEY)
}

export async function isLoggedIn(): Promise<boolean> {
  const token = await getLoginToken()
  if (!token) return false

  try {
    const payload = jwtDecode<JwtPayload>(token)
    return payload.exp > Date.now() / 1000
  } catch {
    return false
  }
}

export async function clearAuth(): Promise<void> {
  cachedToken = null
  await AsyncStorage.removeItem(LOGIN_TOKEN_KEY)
}
