import { existsSync, readdirSync, unlinkSync } from 'fs';
import { mapKeys, mapValues, template } from 'lodash';
import { postcssPlugin } from "../postcss-plugin";
import { solidPlugin } from "../solid-plugin";
import { ENV_VARS } from '../src/env';

if (existsSync('./build')) {
  for (const entry of readdirSync('./build')) {
    unlinkSync(`./build/${entry}`)
  }
}

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./build",
  define: mapKeys(mapValues(ENV_VARS, value => JSON.stringify(value || '')), (_, key) => `Bun.env.${key}`),
  plugins: [solidPlugin, postcssPlugin],
  naming: '[dir]/[name]-[hash].[ext]'
});

const html = template(await Bun.file("./src/index.html").text(), { interpolate: /{{([\s\S]+?)}}/g })({
  jsPath: `/${readdirSync('./build').find(entry => /^index-\w+\.js$/.test(entry))}`,
  cssPath: `/${readdirSync('./build').find(entry => /^index-\w+\.css$/.test(entry))}`
})

await Bun.write('./build/index.html', html)
