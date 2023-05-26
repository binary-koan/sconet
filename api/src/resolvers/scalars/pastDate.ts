import { GraphQLError, GraphQLScalarType } from "graphql"
import { DateResolver } from "graphql-scalars"

// Very crude time zone handling - the browser time zone might be "in the future" so we accept dates up to tomorrow
const oneDayFromNow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date
}

export const PastDate = new GraphQLScalarType({
  name: `PastDate`,

  description: `A date in the past`,

  serialize(value) {
    const date = DateResolver.serialize(value)

    if (new Date(date).getTime() > oneDayFromNow().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${value}`)
    }

    return date
  },

  parseValue(value) {
    const date = DateResolver.parseValue(value)

    if (new Date(date).getTime() > oneDayFromNow().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${value}`)
    }

    return date
  },

  parseLiteral(ast) {
    const date = DateResolver.parseLiteral(ast)

    if (new Date(date).getTime() > oneDayFromNow().getTime()) {
      throw new GraphQLError(`Value is not a past date: ${date}`)
    }

    return date
  }
})
