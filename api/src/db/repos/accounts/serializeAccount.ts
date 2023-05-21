import { AccountRecord } from "../../records/account"
import { serializePartialRecord } from "../../utils/serialize"

export function serializeAccount(account: Partial<AccountRecord>) {
  return serializePartialRecord(account)
}
