// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { objectEntries } from './object-entries'

describe('objectEntries', () => {
  describe('basic functionality', () => {
    it('returns entries for an empty object', () => {
      const obj = {}
      const entries = objectEntries(obj)
      expect(entries).toEqual([])
    })

    it('returns entries for an object with string values', () => {
      const obj = { a: 'hello', b: 'world' }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['a', 'hello'],
        ['b', 'world'],
      ])
    })

    it('returns entries for an object with number values', () => {
      const obj = { x: 1, y: 2, z: 3 }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['x', 1],
        ['y', 2],
        ['z', 3],
      ])
    })

    it('returns entries for an object with boolean values', () => {
      const obj = { active: true, deleted: false }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['active', true],
        ['deleted', false],
      ])
    })
  })

  describe('mixed value types', () => {
    it('handles objects with mixed primitive types', () => {
      const obj = { name: 'Alice', age: 30, active: true }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['name', 'Alice'],
        ['age', 30],
        ['active', true],
      ])
    })

    it('handles objects with null and undefined values', () => {
      const obj = { a: null, b: undefined, c: 'value' }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['a', null],
        ['b', undefined],
        ['c', 'value'],
      ])
    })

    it('handles objects with nested objects', () => {
      const obj = { user: { name: 'Bob' }, count: 5 }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['user', { name: 'Bob' }],
        ['count', 5],
      ])
    })

    it('handles objects with array values', () => {
      const obj = { items: [1, 2, 3], name: 'list' }
      const entries = objectEntries(obj)
      expect(entries).toEqual([
        ['items', [1, 2, 3]],
        ['name', 'list'],
      ])
    })
  })

  describe('type safety', () => {
    it('preserves const object types', () => {
      const obj = { a: 1, b: 'hello', c: true } as const
      const entries = objectEntries(obj)

      // Verify that the entries maintain their structure
      expect(entries).toHaveLength(3)
      expect(entries).toContainEqual(['a', 1])
      expect(entries).toContainEqual(['b', 'hello'])
      expect(entries).toContainEqual(['c', true])
    })

    it('works with interface types', () => {
      interface User {
        name: string
        age: number
        active: boolean
      }

      const user: User = { name: 'Charlie', age: 25, active: false }
      const entries = objectEntries(user)

      expect(entries).toEqual([
        ['name', 'Charlie'],
        ['age', 25],
        ['active', false],
      ])
    })

    it('works with type aliases', () => {
      type Config = {
        host: string
        port: number
        secure: boolean
      }

      const config: Config = { host: 'localhost', port: 8080, secure: true }
      const entries = objectEntries(config)

      expect(entries).toEqual([
        ['host', 'localhost'],
        ['port', 8080],
        ['secure', true],
      ])
    })
  })

  describe('edge cases', () => {
    it('handles objects with special string keys', () => {
      const obj = { 'key-with-dash': 1, 'key.with.dot': 2, 'key with space': 3 }
      const entries = objectEntries(obj)

      expect(entries).toEqual([
        ['key-with-dash', 1],
        ['key.with.dot', 2],
        ['key with space', 3],
      ])
    })

    it('handles objects with numeric string keys', () => {
      const obj = { '0': 'zero', '1': 'one', '100': 'hundred' }
      const entries = objectEntries(obj)

      expect(entries).toEqual([
        ['0', 'zero'],
        ['1', 'one'],
        ['100', 'hundred'],
      ])
    })

    it('handles objects with function values', () => {
      const fn1 = () => 'hello'
      const fn2 = () => 42
      const obj = { greet: fn1, getNumber: fn2 }
      const entries = objectEntries(obj)

      expect(entries).toHaveLength(2)
      expect(entries[0][0]).toBe('greet')
      expect(entries[0][1]).toBe(fn1)
      expect(entries[1][0]).toBe('getNumber')
      expect(entries[1][1]).toBe(fn2)
    })

    it('handles objects with symbol values', () => {
      const sym = Symbol('test')
      const obj = { key: sym, other: 'value' }
      const entries = objectEntries(obj)

      expect(entries).toEqual([
        ['key', sym],
        ['other', 'value'],
      ])
    })

    it('does not include inherited properties', () => {
      const proto = { inherited: 'value' }
      const obj = Object.create(proto)
      obj.own = 'ownValue'

      const entries = objectEntries(obj)

      // Should only include own properties, not inherited ones
      expect(entries).toEqual([['own', 'ownValue']])
      expect(entries).not.toContainEqual(['inherited', 'value'])
    })

    it('does not include non-enumerable properties', () => {
      const obj = {}
      Object.defineProperty(obj, 'hidden', {
        value: 'secret',
        enumerable: false,
      })
      Object.defineProperty(obj, 'visible', {
        value: 'public',
        enumerable: true,
      })

      const entries = objectEntries(obj)

      expect(entries).toEqual([['visible', 'public']])
      expect(entries).not.toContainEqual(['hidden', 'secret'])
    })
  })

  describe('iteration usage', () => {
    it('can be used in for...of loops', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const entries = objectEntries(obj)

      const collected: Array<[string, number]> = []
      for (const [key, value] of entries) {
        collected.push([key, value])
      }

      expect(collected).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
    })

    it('can be used with array methods', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const entries = objectEntries(obj)

      const sum = entries.reduce((acc, [, value]) => acc + value, 0)
      expect(sum).toBe(6)

      const keys = entries.map(([key]) => key)
      expect(keys).toEqual(['a', 'b', 'c'])

      const values = entries.map(([, value]) => value)
      expect(values).toEqual([1, 2, 3])
    })

    it('can be filtered', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 }
      const entries = objectEntries(obj)

      const evenEntries = entries.filter(([, value]) => value % 2 === 0)
      expect(evenEntries).toEqual([
        ['b', 2],
        ['d', 4],
      ])
    })
  })
})
