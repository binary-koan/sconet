import { gql } from "@apollo/client/core"
import { useMutation } from "@apollo/client/react"

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  login: {
    user: {
      token: string
      email: string
    }
  }
}

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        token
        email
      }
    }
  }
`

export function useLoginMutation() {
  return useMutation<LoginResult, LoginInput>(LOGIN_MUTATION)
}

// Transaction Create Mutation
export interface TransactionInput {
  shop: string
  memo?: string
  amountCents: number
  currencyId?: string
  categoryId?: string
  accountId?: string
  date?: string
  includeInReports?: boolean
}

export interface TransactionCreateInput {
  transactionInput: TransactionInput
}

export interface TransactionCreateResult {
  transactionCreate: {
    transaction: {
      id: string
      shop: string
      memo: string
      date: string
      amount: {
        amountDecimal: number
        formatted: string
      }
      category: {
        id: string
        name: string
        color: string
        emoji: string | null
      } | null
    }
  }
}

export const TRANSACTION_CREATE_MUTATION = gql`
  mutation TransactionCreate($transactionInput: TransactionInput!) {
    transactionCreate(input: { transactionInput: $transactionInput }) {
      transaction {
        id
        shop
        memo
        date
        amount {
          amountDecimal
          formatted
        }
        category {
          id
          name
          color
          emoji
        }
      }
    }
  }
`

export function useTransactionCreateMutation() {
  return useMutation<TransactionCreateResult, TransactionCreateInput>(TRANSACTION_CREATE_MUTATION)
}

// Transaction Update Mutation
export interface TransactionUpdateInput {
  id: string
  transactionInput: Partial<TransactionInput>
}

export interface TransactionUpdateResult {
  transactionUpdate: {
    transaction: {
      id: string
    }
  }
}

export const TRANSACTION_UPDATE_MUTATION = gql`
  mutation TransactionUpdate($id: ID!, $transactionInput: TransactionInput!) {
    transactionUpdate(input: { id: $id, transactionInput: $transactionInput }) {
      transaction {
        id
      }
    }
  }
`

export function useTransactionUpdateMutation() {
  return useMutation<TransactionUpdateResult, TransactionUpdateInput>(TRANSACTION_UPDATE_MUTATION)
}

// Transaction Split Mutation
export interface TransactionSplitItemInput {
  memo: string
  categoryId: string | null
  amountCents: number
}

export interface TransactionSplitInput {
  id: string
  splits: TransactionSplitItemInput[]
}

export interface TransactionSplitResult {
  transactionSplit: {
    transaction: {
      id: string
    }
  }
}

export const TRANSACTION_SPLIT_MUTATION = gql`
  mutation TransactionSplit($id: ID!, $splits: [TransactionSplitItemInput!]!) {
    transactionSplit(input: { id: $id, splits: $splits }) {
      transaction {
        id
      }
    }
  }
`

export function useTransactionSplitMutation() {
  return useMutation<TransactionSplitResult, TransactionSplitInput>(TRANSACTION_SPLIT_MUTATION)
}
