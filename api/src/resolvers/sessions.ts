import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from "@simplewebauthn/server"
import bcrypt from "bcryptjs"
import { GraphQLError } from "graphql"
import { SignJWT } from "jose"
import { isEqual } from "lodash"
import { getUser } from "../db/queries/user/getUser"
import { getUserByEmail } from "../db/queries/user/getUserByEmail"
import { updateOneUser } from "../db/queries/user/updateOneUser"
import { UserRecord } from "../db/records/user"
import { userCredentialsRepo } from "../db/repos/userCredentialsRepo"
import { MutationResolvers, QueryResolvers, Resolvers } from "../resolvers-types"
import { origin, rpID, rpName } from "../utils/webauthn"

export const login: MutationResolvers["login"] = async (
  _,
  { email, password, turnstileToken },
  context
) => {
  if (!checkTurnstile(turnstileToken, context.remoteIp)) {
    throw new GraphQLError("Browser verification failed")
  }

  const user = await getUserByEmail(email)

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
  const user = await getUser(context.auth!.userId)

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
  const user = await getUser(context.auth!.userId)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  return await createToken(user)
}

export const registerCredential: MutationResolvers["registerCredential"] = async (
  _,
  _args,
  context
) => {
  const user = await getUser(context.auth!.userId)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  const credentials = await userCredentialsRepo.findForUser(user.id)

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email,
    attestationType: "none",
    excludeCredentials: credentials.map((credential) => ({
      id: credential.credentialId,
      type: "public-key"
    }))
  })

  updateOneUser(user.id, { webauthnChallenge: options.challenge })

  return options
}

export const verifyCredentialRegistration: MutationResolvers["verifyCredentialRegistration"] =
  async (_, { response, device }, context) => {
    const user = await getUser(context.auth!.userId)

    if (!user) {
      throw new GraphQLError("No such user")
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: user.webauthnChallenge!,
      expectedOrigin: origin,
      expectedRPID: rpID
    })

    if (verification.verified && verification.registrationInfo) {
      userCredentialsRepo.insert({
        userId: user.id,
        device,
        credentialId: verification.registrationInfo.credentialID,
        credentialPublicKey: verification.registrationInfo.credentialPublicKey,
        counter: verification.registrationInfo.counter
      })
    }

    return verification.verified
  }

export const generateCredentialLoginOptions: MutationResolvers["generateCredentialLoginOptions"] =
  async (_, { userId }, _context) => {
    const user = await getUser(userId)

    if (!user) {
      throw new GraphQLError("No such user")
    }

    const credentials = await userCredentialsRepo.findForUser(user.id)

    const options = generateAuthenticationOptions({
      allowCredentials: credentials.map((credential) => ({
        id: credential.credentialId,
        type: "public-key"
      })),
      userVerification: "preferred"
    })

    updateOneUser(user.id, { webauthnChallenge: options.challenge })

    // Conflicts with GraphQL JSON's special extensions field
    delete options.extensions

    return options
  }

export const loginViaCredential: MutationResolvers["loginViaCredential"] = async (
  _,
  { response },
  _context
) => {
  const user = await getUser(response.response.userHandle)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  const credentialId = [...Buffer.from(response.id, "base64")]

  const credential = (await userCredentialsRepo.findForUser(user.id)).find((credential) =>
    isEqual([...credential.credentialId], credentialId)
  )

  if (!credential) {
    throw new GraphQLError("Unknown credential")
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: user.webauthnChallenge!,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey: credential.credentialPublicKey,
      credentialID: credential.credentialId,
      counter: credential.counter
    }
  })

  if (verification.verified && verification.authenticationInfo) {
    userCredentialsRepo.updateOne(credential.id, {
      counter: verification.authenticationInfo.newCounter
    })
  }

  if (verification.verified) {
    return await createToken(user)
  } else {
    throw new GraphQLError("Authentication failed")
  }
}

export const deleteCredential: MutationResolvers["deleteCredential"] = async (
  _,
  { id },
  context
) => {
  const user = await getUser(context.auth!.userId)

  if (!user) {
    throw new GraphQLError("No such user")
  }

  const credential = (await userCredentialsRepo.findForUser(user.id)).find(
    (credential) => credential.id === id
  )

  if (!credential) {
    throw new GraphQLError("Unknown credential")
  }

  userCredentialsRepo.softDelete(credential.id)

  return credential
}

export const currentUser: QueryResolvers["currentUser"] = async (_, _args, context) => {
  return (context.auth?.userId && (await getUser(context.auth.userId))) || null
}

export const CurrentUser: Resolvers["CurrentUser"] = {
  id: (user) => user.id,
  email: (user) => user.email,
  registeredCredentials: (user) => userCredentialsRepo.findForUser(user.id)
}

export const UserCredential: Resolvers["UserCredential"] = {
  id: (credential) => credential.id,
  device: (credential) => credential.device,
  createdAt: (credential) => credential.createdAt
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
