import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

export default defineConfig(({ mode }) => ({
  test: {
    setupFiles: ["./test/setup.ts"],
    testTimeout: 10000,
    hookTimeout: 10000,
    env: loadEnv(mode, process.cwd(), ""),
    fileParallelism: false
  }
}))
