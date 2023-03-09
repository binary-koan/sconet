const oldBufferFrom = Buffer.from as any

Buffer.from = function (...args: any[]) {
  const [data, encoding] = args

  if (encoding === "base64" && !data.endsWith("=") && args.length === 2) {
    return oldBufferFrom.call(Buffer, data, "base64url")
  }
  if (!encoding) {
    return oldBufferFrom.call(Buffer, data, "utf-8")
  }
  return oldBufferFrom.call(Buffer, ...args)
} as any

const oldToString = Buffer.prototype.toString as any

Buffer.prototype.toString = function (encoding: any, ...args: any[]) {
  if (encoding === "binary" || encoding === "latin1") {
    return oldToString.call(this, "utf-8", ...args)
  }
  return oldToString.call(this, encoding, ...args)
}

// Makes cbor-x work, which is required by @simplewebauthn/server

const oldBufferAllocateUnsafeSlow = Buffer.allocUnsafeSlow

Buffer.allocUnsafeSlow = function (...args) {
  return oldBufferAllocateUnsafeSlow(...args)
}

export {}
