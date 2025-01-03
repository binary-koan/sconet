import { defineConfig } from "vite"
import deno from "@deno/vite-plugin"
import solid from "vite-plugin-solid"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), solid(), tailwindcss()],
  resolve: {
    alias: {
      "~/": "./src/"
    }
  },
  build: {
    outDir: "./build"
  }
})
