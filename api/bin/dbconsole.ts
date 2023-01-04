import { db } from "../src/db/database"

while (true) {
  const input = prompt(">")

  if (!input) continue

  if (input === "exit") {
    console.log("Bye")
    process.exit(0)
  }

  try {
    const results = db.query(input).all()

    console.log(results)
  } catch (e) {
    console.error(e)
  }
}
