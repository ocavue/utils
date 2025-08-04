import { describe, it, expect } from 'vitest'

import { getId } from './get-id'

describe('getId', () => {
  it('returns a positive number', () => {
    const id = getId()
    expect(id).toBeGreaterThan(0)
  })

  it('returns different values on consecutive calls', () => {
    expect(getId()).not.toBe(getId())
  })
})
