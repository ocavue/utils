// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { isSameValueZero } from './is-same-value-zero'

describe('isSameValueZero', () => {
  describe('primitives', () => {
    it('returns true for identical primitives', () => {
      expect(isSameValueZero(42, 42)).toBe(true)
      expect(isSameValueZero('hello', 'hello')).toBe(true)
      expect(isSameValueZero(true, true)).toBe(true)
      expect(isSameValueZero(null, null)).toBe(true)
      expect(isSameValueZero(undefined, undefined)).toBe(true)
      expect(isSameValueZero(1n, 1n)).toBe(true)
      expect(isSameValueZero(Infinity, Infinity)).toBe(true)
    })

    it('returns false for different primitives', () => {
      expect(isSameValueZero(42, 43)).toBe(false)
      expect(isSameValueZero('hello', 'world')).toBe(false)
      expect(isSameValueZero(true, false)).toBe(false)
      expect(isSameValueZero(Infinity, -Infinity)).toBe(false)
    })

    it('returns false for different types', () => {
      expect(isSameValueZero(42, '42')).toBe(false)
      expect(isSameValueZero(0, false)).toBe(false)
      expect(isSameValueZero('', false)).toBe(false)
      expect(isSameValueZero(null, undefined)).toBe(false)
      expect(isSameValueZero(1n, 1)).toBe(false)
    })
  })

  describe('NaN', () => {
    it('returns true for two NaN values', () => {
      expect(isSameValueZero(NaN, NaN)).toBe(true)
      expect(isSameValueZero(NaN, 0 / 0)).toBe(true)
    })

    it('returns false when only one value is NaN', () => {
      expect(isSameValueZero(NaN, 0)).toBe(false)
      expect(isSameValueZero(0, NaN)).toBe(false)
      expect(isSameValueZero(NaN, 'NaN')).toBe(false)
      expect(isSameValueZero('NaN', NaN)).toBe(false)
      expect(isSameValueZero(NaN, undefined)).toBe(false)
      expect(isSameValueZero(undefined, NaN)).toBe(false)
    })
  })

  describe('signed zero', () => {
    it('returns true for positive and negative zero', () => {
      expect(isSameValueZero(0, -0)).toBe(true)
      expect(isSameValueZero(-0, 0)).toBe(true)
      expect(isSameValueZero(-0, -0)).toBe(true)
    })
  })

  describe('objects', () => {
    it('returns true for the same reference', () => {
      const obj = { a: 1 }
      const arr = [1]
      const fn = () => {}
      expect(isSameValueZero(obj, obj)).toBe(true)
      expect(isSameValueZero(arr, arr)).toBe(true)
      expect(isSameValueZero(fn, fn)).toBe(true)
    })

    it('returns false for different references with equal content', () => {
      expect(isSameValueZero({ a: 1 }, { a: 1 })).toBe(false)
      expect(isSameValueZero([1], [1])).toBe(false)
      expect(isSameValueZero(new Map(), new Map())).toBe(false)
    })

    it('does not coerce objects', () => {
      expect(isSameValueZero(new Number(NaN), NaN)).toBe(false)
      expect(isSameValueZero(new Number(NaN), new Number(NaN))).toBe(false)
      expect(isSameValueZero({ valueOf: () => 1 }, 1)).toBe(false)
    })
  })

  describe('symbols', () => {
    it('compares symbols by identity', () => {
      const symbol = Symbol('a')
      expect(isSameValueZero(symbol, symbol)).toBe(true)
      expect(isSameValueZero(Symbol('a'), Symbol('a'))).toBe(false)
      expect(isSameValueZero(Symbol.for('a'), Symbol.for('a'))).toBe(true)
    })
  })

  it('matches the SameValueZero algorithm used by Array#includes', () => {
    const values = [0, -0, NaN, 1, '1', null, undefined, {}, 1n]
    for (const a of values) {
      for (const b of values) {
        expect(isSameValueZero(a, b)).toBe([a].includes(b))
      }
    }
  })
})
