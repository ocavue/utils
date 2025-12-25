// @vitest-environment node

import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'

import { once } from './once'

describe('once', () => {
  it('executes the wrapped function exactly once', () => {
    const spy = vi.fn(() => Math.random())
    const getRandom = once(spy)

    const first = getRandom()
    const second = getRandom()
    const third = getRandom()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(second).toBe(first)
    expect(third).toBe(first)
  })

  it("returns the underlying function's result", () => {
    const value = { foo: 'bar' }
    const getValue = once(() => value)
    expect(getValue()).toBe(value)
  })

  it('can tree-shake', async () => {
    const esbuild = await import('esbuild')
    const cwd = import.meta.dirname
    const input = path.join(cwd, 'once-stub-2.ts')

    const result = await esbuild.build({
      entryPoints: [input],
      format: 'esm',
      platform: 'neutral',
      minify: true,
      bundle: true,
      write: false,
      absWorkingDir: cwd,
    })

    const files = result.outputFiles.map((file) => {
      return file.text
    })

    expect(files).toMatchInlineSnapshot(`
      [
        "function t(n){let o=!1,e;return()=>(o||(e=n(),o=!0,n=void 0),e)}function r(){console.log("fn1")}var u=t(r);function f(){console.log("fn2")}f();
      ",
      ]
    `)
  })
})
