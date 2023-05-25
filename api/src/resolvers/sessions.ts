import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from "@simplewebauthn/server"
import { GraphQLError } from "graphql"
import { SignJWT } from "jose"
import { isEqual } from "lodash"
import { UserRecord } from "../db/records/user"
import { userCredentialsRepo } from "../db/repos/userCredentialsRepo"
import { usersRepo } from "../db/repos/usersRepo"
import { MutationResolvers } from "../resolvers-types"
import { comparePassword, hashPassword } from "../utils/scrypt"
import { origin, rpID, rpName } from "../utils/webauthn"

export const login: MutationResolvers["login"] = async (
  _,
  { email, password, turnstileToken },
  context
) => {
  if (!checkTurnstile(turnstileToken, context.remoteIp)) {
    throw new GraphQLError("Browser verification failed")
  }

  const user = await usersRepo.getByEmail(email)

  if (!user) {
    throw new GraphQLError("Invalid email or password")
  }

  if (await comparePassword(password, user.encryptedPassword)) {
    return await createToken(user)
  }

  throw new GraphQLError("Invalid email or password")
}

export const changePassword: MutationResolvers["changePassword"] = async (
  _,
  { oldPassword, newPassword },
  context
) => {
  if (!(await comparePassword(oldPassword, context.currentUser.encryptedPassword))) {
    throw new GraphQLError("Invalid email or password")
  }

  usersRepo.updateOne(context.currentUser.id, {
    encryptedPassword: await hashPassword(newPassword)
  })

  return true
}

export const generateNewToken: MutationResolvers["generateNewToken"] = async (
  _,
  _args,
  context
) => {
  return await createToken(context.currentUser)
}

export const registerCredential: MutationResolvers["registerCredential"] = async (
  _,
  _args,
  context
) => {
  const credentials = await userCredentialsRepo.findForUser(context.currentUser.id)

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: context.currentUser.id,
    userName: context.currentUser.email,
    attestationType: "none",
    excludeCredentials: credentials.map((credential) => ({
      id: credential.credentialId,
      type: "public-key"
    }))
  })

  await usersRepo.updateOne(context.currentUser.id, { webauthnChallenge: options.challenge })

  return options
}

export const verifyCredentialRegistration: MutationResolvers["verifyCredentialRegistration"] =
  async (_, { response, device }, context) => {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: context.currentUser.webauthnChallenge!,
      expectedOrigin: origin,
      expectedRPID: rpID
    })

    if (verification.verified && verification.registrationInfo) {
      userCredentialsRepo.insert({
        userId: context.currentUser.id,
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
    const user = await usersRepo.get(userId)

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

    usersRepo.updateOne(user.id, { webauthnChallenge: options.challenge })

    // Conflicts with GraphQL JSON's special extensions field
    delete options.extensions

    return options
  }

export const loginViaCredential: MutationResolvers["loginViaCredential"] = async (
  _,
  { response },
  _context
) => {
  const user = await usersRepo.get(response.response.userHandle)

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
  const credential = (await userCredentialsRepo.findForUser(context.currentUser.id)).find(
    (credential) => credential.id === id
  )

  if (!credential) {
    throw new GraphQLError("Unknown credential")
  }

  userCredentialsRepo.softDelete(credential.id)

  return credential
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
