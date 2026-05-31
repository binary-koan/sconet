import { getLoginToken } from "./auth"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3030/graphql"

const MUTATION = `
  mutation TransactionCreateFromReceipt($receiptImage: Upload!) {
    transactionCreateFromReceipt(input: { receiptImage: $receiptImage }) {
      transaction { id }
    }
  }
`

export interface UploadedReceipt {
  id: string
}

export async function uploadReceiptPhoto(uri: string): Promise<UploadedReceipt> {
  const token = await getLoginToken()

  const filename = uri.split("/").pop() || "receipt.jpg"
  const match = /\.(\w+)$/.exec(filename)
  const ext = match ? match[1].toLowerCase() : "jpg"
  const type = ext === "png" ? "image/png" : "image/jpeg"

  const formData = new FormData()
  formData.append(
    "operations",
    JSON.stringify({
      query: MUTATION,
      variables: { receiptImage: null }
    })
  )
  formData.append("map", JSON.stringify({ "0": ["variables.receiptImage"] }))
  formData.append("0", { uri, name: filename, type } as unknown as Blob)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    },
    body: formData
  })

  const result = (await response.json()) as {
    data?: { transactionCreateFromReceipt: { transaction: UploadedReceipt } }
    errors?: { message: string }[]
  }

  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join(", "))
  }

  if (!result.data) {
    throw new Error("No data returned from receipt upload")
  }

  return result.data.transactionCreateFromReceipt.transaction
}
