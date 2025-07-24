// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { isObject } from './checker'

describe('isObject', () => {
  it('returns true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ foo: 'bar' })).toBe(true)
  })

  it('returns true for arrays', () => {
    expect(isObject([])).toBe(true)
    expect(isObject(['foo'])).toBe(true)
  })

  it('returns false for null and undefined', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isObject(42)).toBe(false)
    expect(isObject(42n)).toBe(false)
    expect(isObject(Number.NaN)).toBe(false)
    expect(isObject(Infinity)).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(false)).toBe(false)
    expect(isObject(Symbol.iterator)).toBe(false)
    expect(isObject(Symbol.for('foo'))).toBe(false)
    expect(isObject(Symbol())).toBe(false)
    expect(isObject('string')).toBe(false)
  })

  it('returns true for class instances', () => {
    class TestClass {}
    expect(isObject(new TestClass())).toBe(true)
  })
})
