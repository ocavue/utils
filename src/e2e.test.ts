// @vitest-environment node

import fs from 'node:fs'
import path from 'node:path'

import { glob } from 'tinyglobby'
import { x } from 'tinyexec'
import { describe, it, expect, beforeAll } from 'vitest'

const ROOT_DIR = path.join(import.meta.dirname, '..')
const E2E_OUT_DIR = path.join(ROOT_DIR, 'e2e', 'out')

describe('e2e', () => {
  beforeAll(async () => {
    await x('pnpm', ['-w', 'build'], { nodeOptions: { cwd: ROOT_DIR, stdio: 'inherit' } })
    await x('pnpm', ['--filter', 'e2e', 'run', 'build'], { nodeOptions: { cwd: ROOT_DIR, stdio: 'inherit' } })
  })

  it('bundler outputs match snapshot', async () => {
    const files = await glob('**/*', { cwd: E2E_OUT_DIR, onlyFiles: true })
    const outputs: Record<string, string> = {}

    for (const file of files.sort()) {
      outputs[file] = fs.readFileSync(path.join(E2E_OUT_DIR, file), 'utf-8')
    }

    expect(outputs).toMatchSnapshot()
  })
})

