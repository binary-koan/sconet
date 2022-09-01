export interface AccountMailboxRecord {
  id: string
  name: string

  mailServerOptions: any

  fromAddressPattern: string | null
  datePattern: string | null
  memoPattern: string | null
  amountPattern: string | null

  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
