import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import devtoolsPlugin from "@solid-devtools/transform"

export default defineConfig({
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
