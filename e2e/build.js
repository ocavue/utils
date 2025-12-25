import * as esbuild from 'esbuild'
import * as rollup from 'rollup'
import fs from 'node:fs'
import path from 'node:path'
import { nodeResolve } from '@rollup/plugin-node-resolve';

const CWD = import.meta.dirname
const SRC_DIR = path.join(CWD, 'src')
const OUT_DIR = path.join(CWD, 'out')

const entries = ['fn1.js', 'fn2.js', 'fn3.js', 'fn4.js']

/**
 * @param {string} entry
 */
async function buildEsbuild(entry) {
  const inputPath = path.join(SRC_DIR, entry)
  const outputPath = path.join(OUT_DIR, 'esbuild', entry)

  await esbuild.build({
    entryPoints: [inputPath],
    outfile: outputPath,
    format: 'esm',
    platform: 'neutral',
    minify: true,
    bundle: true,
  })
}

/**
 * @param {string} entry
 */
async function buildRollup(entry) {
  const inputPath = path.join(SRC_DIR, entry)
  const outputPath = path.join(OUT_DIR, 'rollup', entry)

  const bundle = await rollup.rollup({
    input: inputPath,
    plugins: [nodeResolve()],
  })

  await bundle.write({
    file: outputPath,
    format: 'esm',
  })

  await bundle.close()
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })

  for (const entry of entries) {
    await buildEsbuild(entry)
    await buildRollup(entry)
  }
}

main()
