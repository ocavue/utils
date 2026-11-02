// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { isShallowEqual } from './is-shallow-equal'

describe('isShallowEqual', () => {
  describe('primitives', () => {
    it('returns true for identical primitives', () => {
      expect(isShallowEqual(42, 42)).toBe(true)
      expect(isShallowEqual('hello', 'hello')).toBe(true)
      expect(isShallowEqual(true, true)).toBe(true)
      expect(isShallowEqual(null, null)).toBe(true)
      expect(isShallowEqual(undefined, undefined)).toBe(true)
    })

    it('returns false for different primitives', () => {
      expect(isShallowEqual(42, 43)).toBe(false)
      expect(isShallowEqual('hello', 'world')).toBe(false)
      expect(isShallowEqual(true, false)).toBe(false)
    })

    it('returns false for different types', () => {
      expect(isShallowEqual<unknown>(42, '42')).toBe(false)
      expect(isShallowEqual<unknown>(0, false)).toBe(false)
      expect(isShallowEqual(null, undefined)).toBe(false)
    })

    it('handles NaN and signed zero', () => {
      expect(isShallowEqual(NaN, NaN)).toBe(true)
      expect(isShallowEqual(0, -0)).toBe(true)
      expect(isShallowEqual([NaN], [NaN])).toBe(true)
      expect(isShallowEqual({ a: 0 }, { a: -0 })).toBe(true)
    })
  })

  describe('arrays', () => {
    it('returns true for identical arrays', () => {
      expect(isShallowEqual([], [])).toBe(true)
      expect(isShallowEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    })

    it('returns false for arrays with different lengths', () => {
      expect(isShallowEqual([1, 2], [1, 2, 3])).toBe(false)
      expect(isShallowEqual([1], [])).toBe(false)
    })

    it('returns false for arrays with different values', () => {
      expect(isShallowEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    })

    it('compares nested values by reference', () => {
      const inner = [1]
      expect(isShallowEqual([inner], [inner])).toBe(true)
      expect(isShallowEqual([[1]], [[1]])).toBe(false)
    })
  })

  describe('objects', () => {
    it('returns true for identical objects', () => {
      expect(isShallowEqual({}, {})).toBe(true)
      expect(isShallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    })

    it('returns false for objects with different keys', () => {
      expect(isShallowEqual({ a: 1 }, { b: 1 })).toBe(false)
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
    })

    it('returns false for objects with a missing key', () => {
      expect(isShallowEqual({ a: undefined }, { b: undefined })).toBe(false)
      expect(isShallowEqual({ a: undefined }, {})).toBe(false)
    })

    it('returns false for objects with different values', () => {
      expect(isShallowEqual({ a: 1 }, { a: 2 })).toBe(false)
    })

    it('compares nested values by reference', () => {
      const inner = { b: 1 }
      expect(isShallowEqual({ a: inner }, { a: inner })).toBe(true)
      expect(isShallowEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false)
    })
  })

  describe('Sets', () => {
    it('returns true for identical sets', () => {
      expect(isShallowEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true)
    })

    it('returns false for sets with different values', () => {
      expect(isShallowEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false)
      expect(isShallowEqual(new Set([1]), new Set([1, 2]))).toBe(false)
    })

    it('compares nested values by reference', () => {
      const inner = [1]
      expect(isShallowEqual(new Set([inner]), new Set([inner]))).toBe(true)
      expect(isShallowEqual(new Set([[1]]), new Set([[1]]))).toBe(false)
    })
  })

  describe('Maps', () => {
    it('returns true for identical maps', () => {
      expect(
        isShallowEqual(
          new Map([
            ['a', 1],
            ['b', 2],
          ]),
          new Map([
            ['b', 2],
            ['a', 1],
          ]),
        ),
      ).toBe(true)
    })

    it('returns false for maps with different keys or values', () => {
      expect(isShallowEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(
        false,
      )
      expect(isShallowEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(
        false,
      )
    })

    it('compares nested values by reference', () => {
      const inner = [1]
      expect(
        isShallowEqual(new Map([['a', inner]]), new Map([['a', inner]])),
      ).toBe(true)
      expect(isShallowEqual(new Map([['a', [1]]]), new Map([['a', [1]]]))).toBe(
        false,
      )
    })
  })

  describe('mixed types', () => {
    it('returns false when comparing different collection types', () => {
      expect(isShallowEqual([], {})).toBe(false)
      expect(isShallowEqual({}, [])).toBe(false)
      expect(isShallowEqual<unknown>(new Set(), new Map())).toBe(false)
      expect(isShallowEqual<unknown>(new Map(), {})).toBe(false)
      expect(isShallowEqual<unknown>({}, new Map())).toBe(false)
    })
  })
})
