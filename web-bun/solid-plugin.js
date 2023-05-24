import babel from "@babel/core";
import typescript from "@babel/preset-typescript";
import solid from "babel-preset-solid";
import { BunPlugin } from "bun";

/**
 * @type {BunPlugin}
 */
export const solidPlugin = {
  name: "Solid.js loader",
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, async ({ path }) => {
      const text = await Bun.file(path).text();

      const result = babel.transformSync(text, {
        filename: path,
        presets: [typescript, solid],
      });

      return {
        contents: result.code,
        loader: "js",
      };
    });
  },
};
