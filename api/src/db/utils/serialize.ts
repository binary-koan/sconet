import { mapValues } from "lodash"

type SerializerMap<Record extends object> = {
  [key in keyof Record]?: (value: Record[key]) => string | boolean | number | null
}

export function serializePartialRecord<Record extends object>(
  record: Partial<Record>,
  serializers: SerializerMap<Record>
) {
  return mapValues(record, (value, key: keyof Record) =>
    serializers[key] ? serializers[key]!(value as any) : value
  )
}
