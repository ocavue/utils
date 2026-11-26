// @vitest-environment node

import { describe, expect, it } from 'vitest'

import { range } from './range'

describe('range', () => {
  it('uses a single argument as the end', () => {
    expect(range(4)).toEqual([0, 1, 2, 3])
    expect(range(1)).toEqual([0])
  })

  it('counts down for a single negative argument', () => {
    expect(range(-4)).toEqual([0, -1, -2, -3])
  })

  it('returns an empty array for an empty range', () => {
    expect(range(0)).toEqual([])
    expect(range(3, 3)).toEqual([])
  })

  it('accepts a start and an end', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4])
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1])
  })

  it('counts down when the end is less than the start', () => {
    expect(range(5, 1)).toEqual([5, 4, 3, 2])
  })

  it('accepts a step', () => {
    expect(range(0, 20, 5)).toEqual([0, 5, 10, 15])
    expect(range(0, 10, 3)).toEqual([0, 3, 6, 9])
    expect(range(0, -4, -1)).toEqual([0, -1, -2, -3])
  })

  it('returns an empty array when the step goes the wrong way', () => {
    expect(range(0, 5, -1)).toEqual([])
    expect(range(5, 0, 1)).toEqual([])
  })

  it('repeats the start for a zero step', () => {
    expect(range(1, 4, 0)).toEqual([1, 1, 1])
  })

  it('handles decimal steps', () => {
    expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75])
  })
})
