// @vitest-environment node

import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  noop,
  returnFalse,
  returnNull,
  returnTrue,
  returnUndefined,
} from './noop'

describe('noop', () => {
  it('returns undefined', () => {
    expect(noop()).toBeUndefined()
    expectTypeOf(noop).returns.toEqualTypeOf<undefined>()
  })
})

describe('returnTrue', () => {
  it('returns true', () => {
    expect(returnTrue()).toBe(true)
    expect([1, 2, 3].filter(returnTrue)).toEqual([1, 2, 3])
    expectTypeOf(returnTrue).returns.toEqualTypeOf<true>()
  })
})

describe('returnFalse', () => {
  it('returns false', () => {
    expect(returnFalse()).toBe(false)
    expect([1, 2, 3].filter(returnFalse)).toEqual([])
    expectTypeOf(returnFalse).returns.toEqualTypeOf<false>()
  })
})

describe('returnNull', () => {
  it('returns null', () => {
    expect(returnNull()).toBeNull()
    expectTypeOf(returnNull).returns.toEqualTypeOf<null>()
  })
})

describe('returnUndefined', () => {
  it('returns undefined', () => {
    expect(returnUndefined()).toBeUndefined()
    expectTypeOf(returnUndefined).returns.toEqualTypeOf<undefined>()
  })
})
