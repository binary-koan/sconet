import { file, write } from "bun"
import { exec } from "child_process"
import { existsSync, statSync } from "fs"
import { db } from "./database"

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

  const filesToBackup = [db.filename, `${db.filename}-shm`, `${db.filename}-wal`].filter(
    (path) => existsSync(path) && statSync(path).size > 0
  )

  let alreadyBackedUp = true

  for (const path of filesToBackup) {
    const lastBackedUpAt =
      existsSync(`${path}.backupat`) && new Date(await file(`${path}.backupat`).text())

    if (!lastBackedUpAt || statSync(path).mtime >= lastBackedUpAt) {
      alreadyBackedUp = false
    }
  }

  if (alreadyBackedUp) {
    console.log(`[BACKUP] Database not modified, skipping`)
    return
  }

  const backupStartedAt = new Date()

  // Minio Node has bugs with Bun, so just use the command-line client instead
  await execCommand(
    `mc alias set backup https://${process.env.BUCKET_ENDPOINT} ${process.env.ACCESS_KEY_ID} ${process.env.SECRET_ACCESS_KEY}`
  )

  for (const path of filesToBackup) {
    await execCommand(
      `mc od if=${path} of=backup/${
        process.env.BUCKET_NAME
      }/backup-${backupStartedAt.toISOString()}/${path}`
    )
  }

  console.log("[BACKUP] Success")

  for (const path of filesToBackup) {
    await write(`${path}.backupat`, backupStartedAt.toISOString())
  }
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
