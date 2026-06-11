// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { clamp } from './clamp'

describe('clamp', () => {
  it('returns the value when it is within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(0, -10, 10)).toBe(0)
    expect(clamp(-5, -10, 0)).toBe(-5)
  })

  it('returns the lower bound when the value is below the range', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(-100, -10, 10)).toBe(-10)
  })

  it('returns the upper bound when the value is above the range', () => {
    expect(clamp(11, 0, 10)).toBe(10)
    expect(clamp(100, -10, 10)).toBe(10)
  })

  it('returns the bound when the value equals a bound', () => {
    expect(clamp(0, 0, 10)).toBe(0)
    expect(clamp(10, 0, 10)).toBe(10)
  })

  it('handles a zero-width range', () => {
    expect(clamp(5, 3, 3)).toBe(3)
    expect(clamp(-5, 3, 3)).toBe(3)
  })

  it('handles decimal values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5)
    expect(clamp(1.5, 0, 1)).toBe(1)
    expect(clamp(-0.5, 0, 1)).toBe(0)
  })

  it('handles infinite bounds', () => {
    expect(clamp(100, -Infinity, Infinity)).toBe(100)
    expect(clamp(Infinity, 0, 10)).toBe(10)
    expect(clamp(-Infinity, 0, 10)).toBe(0)
  })

  it('handles negative zero', () => {
    expect(clamp(-0, -1, 1)).toBe(-0)
  })
})
