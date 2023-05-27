import { ASTNode, GraphQLError, GraphQLScalarType, Kind } from "graphql"
import { Currencies } from "ts-money"

const validate = (value: unknown, ast?: ASTNode) => {
  if (typeof value !== "string") {
    throw new GraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined)
  }

  if (!Currencies[value]) {
    throw new GraphQLError(
      `Value is not a valid currency value: ${value}`,
      ast ? { nodes: ast } : undefined
    )
  }

  return value
}

export const CurrencyCode = new GraphQLScalarType({
  name: `CurrencyCode`,

  description: `A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217.`,

  serialize(value) {
    return validate(value)
  },

  parseValue(value) {
    return validate(value)
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Can only validate strings as a currency but got a: ${ast.kind}`, {
        nodes: ast
      })
    }

    return validate(ast.value, ast)
  }
})
