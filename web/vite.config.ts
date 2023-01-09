import devtoolsPlugin from "@solid-devtools/transform"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  envDir: ".",
  plugins: [
    solidPlugin(),
    devtoolsPlugin({
      name: true
    })
  ],
  server: {
    port: 1234
  },
  build: {
    target: "esnext"
  }
})
