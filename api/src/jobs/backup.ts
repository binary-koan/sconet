import { minBy } from "lodash"
import { Client } from "minio"
import { Readable } from "stream"
import { Repo } from "../db/repo"
import { accountsRepo } from "../db/repos/accountsRepo"
import { categoriesRepo } from "../db/repos/categoriesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"
import { userCredentialsRepo } from "../db/repos/userCredentialsRepo"
import { usersRepo } from "../db/repos/usersRepo"

interface BackupDetails {
  backupTimestamps: { [key: string]: string }
}

const BACKUP_INTERVAL_HOURS = 8
const BACKUPS_TO_KEEP = (14 * 24) / BACKUP_INTERVAL_HOURS

const REPOS_TO_BACKUP = [
  transactionsRepo,
  categoriesRepo,
  accountsRepo,
  usersRepo,
  userCredentialsRepo
]

export const startBackupSchedule = () =>
  setInterval(runBackup, BACKUP_INTERVAL_HOURS * 60 * 60 * 1000)

export async function runBackup() {
  if (
    !Bun.env.ACCESS_KEY_ID ||
    !Bun.env.SECRET_ACCESS_KEY ||
    !Bun.env.BUCKET_ENDPOINT ||
    !Bun.env.BUCKET_NAME
  ) {
    console.warn("[BACKUP] Missing AWS credentials, not backing up")
    return
  }

  const s3 = new Client({
    endPoint: Bun.env.BUCKET_ENDPOINT,
    useSSL: true,
    accessKey: Bun.env.ACCESS_KEY_ID,
    secretKey: Bun.env.SECRET_ACCESS_KEY
  })

  const backupDetails = await getBackupDetails(s3)
  const backupIndex = getBackupIndex(backupDetails)

  backupDetails.backupTimestamps[backupIndex] = new Date().toISOString()

  for (const repo of REPOS_TO_BACKUP) {
    await backupRepo(repo, backupIndex, s3)
  }

  await Bun.write("backup-details.json", JSON.stringify(backupDetails, null, 2) + "\n")
  await s3.fPutObject(Bun.env.BUCKET_NAME!, "backup-details.json", "backup-details.json")

  console.log("[BACKUP] Success")
}

const backupRepo = async (repo: Repo<any, any>, backupIndex: string, s3: Client) => {
  let offset = 0

  while (true) {
    const rows = await repo.findAll({ limit: 500, offset })
    const path = `${repo.tableName}-${offset}.json`
    const fullPath = `backup-${backupIndex}/${path}`

    await Bun.write(path, JSON.stringify({ rows }, null, 2) + "\n")
    await s3.fPutObject(Bun.env.BUCKET_NAME!, fullPath, path)

    if (rows.length < 500) break

    offset += 500
  }
}

async function getBackupDetails(s3: Client) {
  const objects: any[] = []
  const objectStream = s3.listObjectsV2(Bun.env.BUCKET_NAME!)

  await new Promise<void>((resolve, reject) => {
    objectStream.on("data", (chunk) => objects.push(chunk))
    objectStream.on("error", (err) => reject(err))
    objectStream.on("end", () => resolve())
  })

  if (objects.some((object) => object.name === "backup-details.json")) {
    const content = await streamToString(
      await s3.getObject(Bun.env.BUCKET_NAME!, "backup-details.json")
    )
    return JSON.parse(content)
  } else {
    return { backupTimestamps: {} }
  }
}

function getBackupIndex(backupDetails: BackupDetails) {
  const timestamps = backupDetails.backupTimestamps || {}

  if (Object.keys(timestamps).length < BACKUPS_TO_KEEP) {
    return Object.keys(timestamps).length.toString()
  }

  const [oldestIndex] =
    minBy(Object.entries(timestamps), ([, timestamp]) => new Date(timestamp).getTime()) || []

  return oldestIndex || "0"
}

function streamToString(stream: Readable) {
  const chunks: Buffer[] = []
  return new Promise<string>((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

runBackup()
