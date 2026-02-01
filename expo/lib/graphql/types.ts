export interface Money {
  amountDecimal: number
  formatted: string
}

export interface Currency {
  id: string
  code?: string
  symbol?: string
  decimalDigits?: number
}

export interface Category {
  id: string
  name: string
  color?: string
  emoji?: string | null
}

export interface Account {
  id: string
  name: string
  currency?: Currency
}

export interface SplitTransaction {
  id: string
  memo?: string
  amount?: Money
  shopAmount?: Money
  category?: Category
  includeInReports?: boolean
}

export interface Transaction {
  id: string
  shop: string
  memo?: string
  date: string
  amount?: Money
  currency?: Currency
  shopAmount?: Money
  shopCurrency?: Currency
  includeInReports?: boolean
  category?: Category
  account?: Account
  splitTo?: SplitTransaction[]
}

export interface PageInfo {
  endCursor?: string
}

export interface TransactionsConnection {
  nodes: Transaction[]
  pageInfo: PageInfo
}

export interface TransactionsQuery {
  transactions: TransactionsConnection
}

export interface TransactionFilterInput {
  dateFrom?: string
  dateUntil?: string
  minAmountCents?: number
  maxAmountCents?: number
  keyword?: string
  categoryIds?: string[]
}

export interface TransactionsQueryVariables {
  limit?: number
  offset?: string
  filter?: TransactionFilterInput
}
