import { file, write } from "bun"
import { exec } from "child_process"
import { existsSync, statSync } from "fs"
import { db } from "./database"
import { accountMailboxesRepo } from "./repos/accountMailboxesRepo"
import { categoriesRepo } from "./repos/categoriesRepo"
import { currenciesRepo } from "./repos/currenciesRepo"
import { transactionsRepo } from "./repos/transactionsRepo"

interface BackupDetails {
  lastBackupAt?: string
  backupIndex: number
}

const BACKUPS_TO_KEEP: number = 3

const REPOS_TO_BACKUP = [transactionsRepo, categoriesRepo, accountMailboxesRepo, currenciesRepo]

export const backupDatabase = async () => {
  if (
    !process.env.ACCESS_KEY_ID ||
    !process.env.SECRET_ACCESS_KEY ||
    !process.env.BUCKET_ENDPOINT ||
    !process.env.BUCKET_NAME
  ) {
    console.warn("[BACKUP] Missing AWS credentials, not backing up")
    return
  }

  const backupDetails: BackupDetails = existsSync("data/backup-details.json")
    ? JSON.parse(await file("data/backup-details.json").text())
    : { backupIndex: 0 }

  const databaseFiles = [db.filename, `${db.filename}-shm`, `${db.filename}-wal`]
  if (
    databaseFiles.every(
      (path) =>
        backupDetails.lastBackupAt && statSync(path).mtime >= new Date(backupDetails.lastBackupAt)
    )
  ) {
    console.log(`[BACKUP] Database not modified, skipping`)
    return
  }

  // Minio Node has bugs with Bun, so just use the command-line client instead
  await execCommand(
    `mc alias set backup https://${process.env.BUCKET_ENDPOINT} ${process.env.ACCESS_KEY_ID} ${process.env.SECRET_ACCESS_KEY}`
  )

  backupDetails.backupIndex = (backupDetails.backupIndex + 1) % BACKUPS_TO_KEEP
  backupDetails.lastBackupAt = new Date().toISOString()

  for (const repo of REPOS_TO_BACKUP) {
    let offset = 0

    while (true) {
      const rows = repo.findAll({ limit: 1000, offset })
      const path = `data/backup-${repo.tableName}-${offset}.json`

      await write(path, JSON.stringify(rows))

      await execCommand(
        `mc od if=${path} of=backup/${process.env.BUCKET_NAME}/backup-${backupDetails.backupIndex}/${path}`
      )

      if (rows.length < 1000) break

      offset += 1000
    }
  }

  console.log("[BACKUP] Success")

  await write("data/backup-details.json", JSON.stringify(backupDetails))
  await execCommand(
    `mc od if=data/backup-details.json of=backup/${process.env.BUCKET_NAME}/backup-${backupDetails.backupIndex}/backup-details.json`
  )
}

const execCommand = (command: string) => {
  console.log(`[BACKUP] Executing ${command}`)
  return new Promise<void>((resolve, reject) => {
    const process = exec(command)

    process.addListener("exit", (code) => {
      if (code !== 0) reject(`Command '${command}' exited with code ${code}`)
      resolve()
    })
  })
}
