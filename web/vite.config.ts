import devtoolsPlugin from "solid-devtools/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  envDir: ".",
  plugins: [
    solidPlugin(),
    devtoolsPlugin({
      autoname: true
    })
  ],
  server: {
    port: 1234
  },
  build: {
    target: "esnext"
  }
})
