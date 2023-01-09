import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import { SignJWT } from "jose"
import { getUser } from "../db/queries/user/getUser"
import { getUserByEmail } from "../db/queries/user/getUserByEmail"
import { updateOneUser } from "../db/queries/user/updateOneUser"
import { UserRecord } from "../db/records/user"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"

export const login: MutationResolvers["login"] = async (
  _,
  { email, password, turnstileToken },
  context
) => {
  if (!checkTurnstile(turnstileToken, context.remoteIp)) {
    throw new GraphQLError("Browser verification failed")
  }

  const user = getUserByEmail(email)

  if (!user) {
    throw new GraphQLError("Invalid email or password")
  }

  if (await bcrypt.compare(password, user.encryptedPassword)) {
    return await createToken(user)
  }

  throw new GraphQLError("Invalid email or password")
}

export const changePassword: MutationResolvers["changePassword"] = async (
  _,
  { oldPassword, newPassword },
  context
) => {
  const user = getUser(context.auth!.userId)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  if (!(await bcrypt.compare(oldPassword, user.encryptedPassword))) {
    throw new GraphQLError("Invalid email or password")
  }

  updateOneUser(user.id, { encryptedPassword: await bcrypt.hash(newPassword, 10) })

  return true
}

export const generateNewToken: MutationResolvers["generateNewToken"] = async (
  _,
  _args,
  context
) => {
  const user = getUser(context.auth!.userId)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  return await createToken(user)
}

export const currentUser: QueryResolvers["currentUser"] = (_, _args, context) => {
  return (context.auth?.userId && getUser(context.auth.userId)) || null
}

export const CurrentUser: Resolvers["CurrentUser"] = {
  id: (user) => user.id,
  email: (user) => user.email
}

const createToken = (user: UserRecord) => {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setExpirationTime("14d")
    .sign(Buffer.from(process.env.JWT_SECRET!))
}

const checkTurnstile = async (token: string, ip?: string) => {
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
  const result = await fetch(url, {
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  })

  const outcome: { success: boolean } = await result.json()

  if (!outcome.success) {
    console.log("CloudFlare verification failed", outcome)
  }

  return outcome.success
}
