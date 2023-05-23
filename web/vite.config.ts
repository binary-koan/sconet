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
  optimizeDeps: {
    extensions: ["jsx"]
  },
  server: {
    port: 1235
  },
  build: {
    target: "esnext"
  }
})
