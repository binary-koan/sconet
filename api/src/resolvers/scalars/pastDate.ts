import { GraphQLError, GraphQLScalarType } from "graphql"
import { DateResolver } from "graphql-scalars"

export const PastDate = new GraphQLScalarType({
  name: `PastDate`,

  description: `A date in the past`,

  serialize(value) {
    const date = DateResolver.serialize(value)

    if (new Date(date).getTime() > new Date().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${value}`)
    }

    return date
  },

  parseValue(value) {
    const date = DateResolver.parseValue(value)

    if (new Date(date).getTime() > new Date().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${value}`)
    }

    return date
  },

  parseLiteral(ast) {
    const date = DateResolver.parseLiteral(ast)

    if (new Date(date).getTime() > new Date().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${date}`)
    }

    return date
  }
})
