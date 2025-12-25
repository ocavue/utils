// @vitest-environment node

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { describe, it, expect, beforeAll } from 'vitest'

const ROOT_DIR = path.join(import.meta.dirname, '..')
const E2E_OUT_DIR = path.join(ROOT_DIR, 'e2e', 'out')

describe('e2e', () => {
  beforeAll(() => {
    execSync('pnpm -w build', { cwd: ROOT_DIR, stdio: 'inherit' })
    execSync('pnpm --filter e2e run build', { cwd: ROOT_DIR, stdio: 'inherit' })
  })

  it('bundler outputs match snapshot', () => {
    const outputs: Record<string, string> = {}

    function scanDir(dir: string, prefix = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.join(prefix, entry.name)
        if (entry.isDirectory()) {
          scanDir(fullPath, relativePath)
        } else if (entry.isFile()) {
          outputs[relativePath] = fs.readFileSync(fullPath, 'utf-8')
       } 
      }
    }

    scanDir(E2E_OUT_DIR)

    expect(outputs).toMatchSnapshot()
  })
})

