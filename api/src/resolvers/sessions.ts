import { GraphQLError } from "graphql"
import { getUserByEmail } from "../db/user/getUserByEmail"
import { MutationResolvers } from "../resolvers-types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getUser } from "../db/user/getUser"
import { updateOneUser } from "../db/user/updateOneUser"

export const login: MutationResolvers["login"] = async (_, { email, password }) => {
  const user = getUserByEmail(email)

  if (!user) {
    throw new GraphQLError("Invalid email or password")
  }

  if (await bcrypt.compare(password, user.encryptedPassword)) {
    return jwt.sign({}, process.env.JWT_SECRET!, {
      subject: user.id,
      expiresIn: "14d"
    })
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

  return jwt.sign({}, process.env.JWT_SECRET!, {
    subject: user.id,
    expiresIn: "14d"
  })
}
