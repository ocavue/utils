// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

import { debounce } from './debounce'

describe('debounce', () => {
  it('does not call the function immediately', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced()
    expect(spy).toHaveBeenCalledTimes(0)

    vi.useRealTimers()
  })

  it('calls the function after the wait period', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced()

    vi.advanceTimersByTime(99)
    expect(spy).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1)
    expect(spy).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('passes arguments correctly', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced('a', 'b')
    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledWith('a', 'b')

    vi.useRealTimers()
  })

  it('calls the function once with the latest args for a series of calls', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced('first')
    debounced('second')
    debounced('third')

    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('third')

    vi.useRealTimers()
  })

  it('restarts the wait period on every call', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced('first')
    vi.advanceTimersByTime(99)
    debounced('second')
    vi.advanceTimersByTime(99)
    debounced('third')
    vi.advanceTimersByTime(99)

    expect(spy).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(1)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('third')

    vi.useRealTimers()
  })

  it('calls the function again for a new series of calls', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100)

    debounced('first')
    vi.advanceTimersByTime(100)
    expect(spy).toHaveBeenCalledTimes(1)

    debounced('second')
    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith('second')

    vi.useRealTimers()
  })

  it('preserves this context', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const obj = {
      value: 42,
      debounced: debounce(function (this: { value: number }) {
        spy(this.value)
      }, 100),
    }

    obj.debounced()
    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(42)

    vi.useRealTimers()
  })

  it('uses the default behavior when passed an empty options object', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const debounced = debounce(spy, 100, {})

    debounced('first')
    debounced('second')

    expect(spy).toHaveBeenCalledTimes(0)

    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('second')

    vi.useRealTimers()
  })

  describe('with { leading: true }', () => {
    it('calls the function immediately on first invocation', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, { leading: true })

      debounced('first')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })

    it('preserves this context on leading call', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const obj = {
        value: 42,
        debounced: debounce(
          function (this: { value: number }) {
            spy(this.value)
          },
          100,
          { leading: true },
        ),
      }

      obj.debounced()
      expect(spy).toHaveBeenCalledWith(42)

      vi.useRealTimers()
    })

    it('does not fire trailing call if no calls during wait', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, { leading: true })

      debounced('first')
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('executes trailing call with latest args after wait period', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, { leading: true })

      debounced('first')
      debounced('second')
      debounced('third')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.advanceTimersByTime(100)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith('third')

      vi.useRealTimers()
    })

    it('allows a new leading call after the wait period has elapsed', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, { leading: true })

      debounced('first')
      vi.advanceTimersByTime(100)

      debounced('second')

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith('second')

      vi.useRealTimers()
    })

    it('does not make a leading call while the wait period keeps restarting', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, { leading: true })

      debounced('first')
      vi.advanceTimersByTime(99)
      debounced('second')
      vi.advanceTimersByTime(99)
      debounced('third')

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })
  })

  describe('with { signal }', () => {
    it('behaves as usual before the signal is aborted', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const controller = new AbortController()
      const debounced = debounce(spy, 100, { signal: controller.signal })

      debounced('first')
      debounced('second')

      vi.advanceTimersByTime(100)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('second')

      vi.useRealTimers()
    })

    it('cancels the pending call when the signal is aborted', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const controller = new AbortController()
      const debounced = debounce(spy, 100, { signal: controller.signal })

      debounced('first')
      vi.advanceTimersByTime(50)

      controller.abort()
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(0)

      vi.useRealTimers()
    })

    it('ignores calls made after the signal is aborted', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const controller = new AbortController()
      const debounced = debounce(spy, 100, { signal: controller.signal })

      debounced('first')
      vi.advanceTimersByTime(100)
      expect(spy).toHaveBeenCalledTimes(1)

      controller.abort()

      debounced('second')
      debounced('third')
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })

    it('never calls the function when the signal is already aborted', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const debounced = debounce(spy, 100, {
        leading: true,
        signal: AbortSignal.abort(),
      })

      debounced('first')
      debounced('second')
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(0)

      vi.useRealTimers()
    })

    it('cancels the pending trailing call with { leading: true }', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const controller = new AbortController()
      const debounced = debounce(spy, 100, {
        leading: true,
        signal: controller.signal,
      })

      debounced('first')
      debounced('second')
      expect(spy).toHaveBeenCalledTimes(1)

      controller.abort()
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })
  })
})
