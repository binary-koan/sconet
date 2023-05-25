import { randomBytes, scrypt } from "node:crypto"

export function hashPassword(password: string, existingSalt?: string) {
  return new Promise<string>((resolve, reject) => {
    // generate random 16 bytes long salt
    const salt = existingSalt || randomBytes(16).toString("hex")

    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ":" + derivedKey.toString("hex"))
    })
  })
}

export async function comparePassword(password: string, encrypted: string) {
  const [salt, key] = encrypted.split(":")
  const keyToCompare = await hashPassword(password, salt)

  return key === keyToCompare
}
