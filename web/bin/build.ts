import { createHash } from 'crypto';
import { readdirSync, renameSync, unlinkSync } from 'fs';
import { mapKeys, mapValues, template } from 'lodash';
import { postcssPlugin } from "../postcss-plugin";
import { solidPlugin } from "../solid-plugin";
import { ENV_VARS } from '../src/env';

for (const entry of readdirSync('./build')) {
  unlinkSync(`./build/${entry}`)
}

await Bun.build({
  entrypoints: ["./src/index.tsx"],
  outdir: "./build",
  define: mapKeys(mapValues(ENV_VARS, value => JSON.stringify(value || '')), (_, key) => `Bun.env.${key}`),
  plugins: [solidPlugin, postcssPlugin],
});

const jsContents = await Bun.file('./build/index.js').text()
const jsFilename = `index-${createHash('sha256').update(jsContents).digest('hex').slice(0, 16)}.js`

renameSync('./build/index.js', `./build/${jsFilename}`)

const html = template(await Bun.file("./src/index.html").text(), { interpolate: /{{([\s\S]+?)}}/g })({
  jsPath: `/${jsFilename}`,
  cssPath: `/${readdirSync('./build').find(entry => entry.endsWith('.css'))}`
})

await Bun.write('./build/index.html', html)
