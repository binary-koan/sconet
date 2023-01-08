import { exec } from "child_process"
import { statSync } from "fs"
import { db } from "./database"

let lastBackedUpAt: Date | undefined

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

  if (lastBackedUpAt && statSync(db.filename).mtime < lastBackedUpAt) {
    console.log("[BACKUP] Database not modified, skipping")
    return
  }

  const backupStartedAt = new Date()

  // Minio Node has bugs with Bun, so just use the command-line client instead
  await execCommand(
    `mc alias set backup https://${process.env.BUCKET_ENDPOINT} ${process.env.ACCESS_KEY_ID} ${process.env.SECRET_ACCESS_KEY}`
  )

  await execCommand(`mc od if=${db.filename} of=backup/${process.env.BUCKET_NAME}/db-backup.sqlite`)

  console.log("[BACKUP] Success")

  lastBackedUpAt = backupStartedAt
}

const execCommand = (command: string) => {
  return new Promise<void>((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)

      if (error) reject(error)
      resolve()
    })
  )
}
