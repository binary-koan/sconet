import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils"
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from "graphql"
import { Context } from "../../context"

const DIRECTIVE_NAME = "authenticated"

export function applyAuthenticatedDirective(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, _typeName) => {
      const authDirective = getDirective(schema, fieldConfig, DIRECTIVE_NAME)?.[0]

      if (!authDirective) {
        return
      }

      const { resolve = defaultFieldResolver } = fieldConfig

      fieldConfig.resolve = function (source, args, context: Context, info) {
        if (!context.auth?.userId) {
          throw new GraphQLError("Not logged in")
        }

        return resolve(source, args, context, info)
      }
      return fieldConfig
    }
  })
}
