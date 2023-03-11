import { fromPairs, mapKeys } from "lodash"
import { assertFieldName } from "./assertFieldName"

export function fieldsUpdateQuery(fields: { [key: string]: any }) {
  return Object.keys(fields)
    .map(assertFieldName)
    .map((key) => `${key} = $${key}`)
    .join(", ")
}

export function fieldsInsertQuery(id: string, fields: { [key: string]: any }) {
  const allFields = { id, ...fields }
  const keys = Object.keys(allFields).map(assertFieldName)

  return `(${keys.join(", ")}) VALUES (${keys.map((key) => `$${key}`).join(", ")})`
}

export function fieldBindings(fields: { [key: string]: any }) {
  return mapKeys(fields, (_, key) => `$${key}`)
}

export function arrayBindings(values: readonly string[], prefix: string = "") {
  return fromPairs(values.map((id, index) => [`$${prefix}${index}`, id]))
}

export function arrayQuery(values: readonly any[], prefix: string = "") {
  return `(${values.map((_, index) => `$${prefix}${index}`).join(",")})`
}

export function commonTableExpressionBindings(
  values: ReadonlyArray<Record<string, any>>,
  prefix: string = ""
) {
  return fromPairs(
    values.flatMap((value, index) =>
      Object.entries(value).map(([key, value]) => [`$${prefix}${index}_${key}`, value])
    )
  )
}

export function commonTableExpressionQuery(
  values: ReadonlyArray<Record<string, any>>,
  prefix: string = ""
) {
  return values
    .map(
      (value, index) =>
        "(" +
        Object.keys(value)
          .map((key) => `$${prefix}${index}_${key}`)
          .join(",") +
        ")"
    )
    .join(", ")
}
