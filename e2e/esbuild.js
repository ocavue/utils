import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

const CWD = import.meta.dirname
const SRC_DIR = path.join(CWD, 'src')
const OUT_DIR = path.join(CWD, 'out')

const entries = ['fn1.js', 'fn2.js', 'fn3.js', 'fn4.js']

/**
 * @param {string} entry
 */
function buildEsbuild(entry) {
  const inputPath = path.join(SRC_DIR, entry)
  const outputPath = path.join(OUT_DIR, 'esbuild', entry)

  return esbuild.build({
    entryPoints: [inputPath],
    outfile: outputPath,
    format: 'esm',
    platform: 'neutral',
    minify: true,
    bundle: true,
  })
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })

  for (const entry of entries) {
    await buildEsbuild(entry)
  }
}

main()
