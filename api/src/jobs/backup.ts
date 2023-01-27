import { file, write } from "bun"
import { exec } from "child_process"
import { existsSync, statSync } from "fs"
import { db } from "../db/database"
import { Repo } from "../db/repo"
import { accountMailboxesRepo } from "../db/repos/accountMailboxesRepo"
import { categoriesRepo } from "../db/repos/categoriesRepo"
import { currenciesRepo } from "../db/repos/currenciesRepo"
import { transactionsRepo } from "../db/repos/transactionsRepo"

interface BackupDetails {
  lastBackupAt?: string
  backupIndex: number
}

const BACKUPS_TO_KEEP: number = 3

const REPOS_TO_BACKUP = [transactionsRepo, categoriesRepo, accountMailboxesRepo, currenciesRepo]

export const startBackupSchedule = () => setInterval(runBackup, 5 * 60 * 1000)

export const runBackup = async () => {
  if (
    !process.env.ACCESS_KEY_ID ||
    !process.env.SECRET_ACCESS_KEY ||
    !process.env.BUCKET_ENDPOINT ||
    !process.env.BUCKET_NAME
  ) {
    console.warn("[BACKUP] Missing AWS credentials, not backing up")
    return
  }

  const backupDetails = await readBackupDetails()

  if (!databaseModified(backupDetails)) {
    console.log("[BACKUP] Database not modified, skipping")
    return
  }

  await setupMinio()

  backupDetails.backupIndex = (backupDetails.backupIndex + 1) % BACKUPS_TO_KEEP
  backupDetails.lastBackupAt = new Date().toISOString()

  for (const repo of REPOS_TO_BACKUP) {
    await backupRepo(repo, backupDetails)
  }

  await storeBackupDetails(backupDetails)

  console.log("[BACKUP] Success")
}

const databaseModified = ({ lastBackupAt }: BackupDetails) => {
  const databaseFiles = [db.filename, `${db.filename}-shm`, `${db.filename}-wal`]

  if (!lastBackupAt) return true

  return databaseFiles.some((path) => statSync(path).mtime >= new Date(lastBackupAt))
}

const setupMinio = async () => {
  // Minio Node has bugs with Bun, so just use the command-line client instead
  const command = `mc alias set backup https://${process.env.BUCKET_ENDPOINT}`

  console.log(`[BACKUP] Executing ${command} ACCESS_KEY_ID SECRET_ACCESS_KEY`)
  await execCommand(`${command} ${process.env.ACCESS_KEY_ID} ${process.env.SECRET_ACCESS_KEY}`)
}

const backupRepo = async (repo: Repo<any, any, any>, backupDetails: BackupDetails) => {
  let offset = 0

  while (true) {
    const rows = repo.findAll({ limit: 500, offset })
    const path = `data/backup-${repo.tableName}-${offset}.json`

    await write(path, JSON.stringify(rows))

    const command = `mc od if=${path} of=backup/${process.env.BUCKET_NAME}/backup-${backupDetails.backupIndex}/${path}`

    console.log(`[BACKUP] Executing ${command}`)
    await execCommand(command)

    if (rows.length < 500) break

    offset += 500
  }
}

const readBackupDetails = async (): Promise<BackupDetails> => {
  return existsSync(backupDetailsPath())
    ? JSON.parse(await file(backupDetailsPath()).text())
    : { backupIndex: 0 }
}

const storeBackupDetails = async (backupDetails: BackupDetails) => {
  await write(backupDetailsPath(), JSON.stringify(backupDetails))
  await execCommand(
    `mc od if=${backupDetailsPath()} of=backup/${process.env.BUCKET_NAME}/backup-${
      backupDetails.backupIndex
    }/backup-details.json`
  )
}

const backupDetailsPath = () => "data/backup-details.json"

const execCommand = (command: string) => {
  return new Promise<void>((resolve, reject) => {
    const process = exec(command)

    process.addListener("exit", (code) => {
      if (code !== 0) reject(`Command '${command}' exited with code ${code}`)
      resolve()
    })
  })
}
