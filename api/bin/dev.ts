import path from "path"
import { startServer } from "../src/server"

const webPath = path.resolve(import.meta.dir, "../../web")

startServer([`${webPath}/build`, `${webPath}/public`])
