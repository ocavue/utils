import * as esbuild from 'esbuild'
import fs from 'node:fs'

const entryPoints = [
  { input: 'src/fn1.js', output: 'out/fn1.js' },
  { input: 'src/fn2.js', output: 'out/fn2.js' },
  { input: 'src/fn3.js', output: 'out/fn3.js' },
]

async function main() {
  const outDir = path.join(  import.meta.dirname, 'out')



  for (const { input, output } of entryPoints) {
    await esbuild.build({
      entryPoints: [input],
      outfile: output,
      format: 'esm',
      platform: 'neutral',
      minify: true,
    })
  }
}

main()
