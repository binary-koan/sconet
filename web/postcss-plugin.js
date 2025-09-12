import autoprefixer from "autoprefixer"
import { BunPlugin } from "bun"
import postcss from "postcss"
import tailwindcss from "@tailwindcss/postcss"
import tailwindConfig from "./tailwind.config"

/**
 * @type {BunPlugin}
 */
export const postcssPlugin = {
  name: "PostCSS loader",
  setup(build) {
    const css = postcss([tailwindcss(tailwindConfig), autoprefixer])

    build.onLoad({ filter: /\.css$/ }, async ({ path }) => {
      try {
        const result = await css.process(await Bun.file(path).text(), { from: path })

        return {
          contents: result.css,
          loader: "file"
        }
      } catch (e) {
        console.error(e)
      }
    })
  }
}
