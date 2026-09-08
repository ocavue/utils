// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

import { throttle } from './throttle'

describe('throttle', () => {
  it('calls the function immediately on first invocation', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled()
    expect(spy).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('passes arguments correctly', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled('a', 'b')
    expect(spy).toHaveBeenCalledWith('a', 'b')

    vi.useRealTimers()
  })

  it('ignores calls during the wait period', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled()
    throttled()
    throttled()

    expect(spy).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('executes trailing call with latest args after wait period', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled('first')
    throttled('second')
    throttled('third')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('first')

    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith('third')

    vi.useRealTimers()
  })

  it('allows a new call after the wait period has elapsed', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled()
    expect(spy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttled()
    expect(spy).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })

  it('preserves this context on leading call', () => {
    vi.useFakeTimers()

    const obj = {
      value: 42,
      throttled: throttle(function (this: { value: number }) {
        return this.value
      }, 100),
    }

    const spy = vi.fn()
    obj.throttled = throttle(function (this: { value: number }) {
      spy(this.value)
    }, 100)

    obj.throttled()
    expect(spy).toHaveBeenCalledWith(42)

    vi.useRealTimers()
  })

  it('preserves this context on trailing call', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const obj = {
      value: 42,
      throttled: throttle(function (this: { value: number }) {
        spy(this.value)
      }, 100),
    }

    obj.throttled()
    obj.throttled()

    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith(42)

    vi.useRealTimers()
  })

  it('does not fire trailing call if no calls during wait', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled()
    expect(spy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(200)

    expect(spy).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })

  it('does not call the function again immediately after a trailing call', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100)

    throttled('first')
    throttled('second')

    vi.advanceTimersByTime(100)
    expect(spy).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(1)
    throttled('third')
    expect(spy).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(99)
    expect(spy).toHaveBeenCalledTimes(3)
    expect(spy).toHaveBeenLastCalledWith('third')

    vi.useRealTimers()
  })

  it('uses the default behavior when passed an empty options object', () => {
    vi.useFakeTimers()

    const spy = vi.fn()
    const throttled = throttle(spy, 100, {})

    throttled('first')
    throttled('second')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('first')

    vi.advanceTimersByTime(100)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith('second')

    vi.useRealTimers()
  })

  describe('with { leading: false }', () => {
    it('does not call the function on the leading edge', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { leading: false })

      throttled()
      expect(spy).toHaveBeenCalledTimes(0)

      vi.useRealTimers()
    })

    it('calls the function on the trailing edge with the latest args', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { leading: false })

      throttled('first')
      throttled('second')
      throttled('third')

      expect(spy).toHaveBeenCalledTimes(0)

      vi.advanceTimersByTime(100)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('third')

      vi.useRealTimers()
    })

    it('does not push back the trailing call when called again in the wait period', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { leading: false })

      throttled('first')
      vi.advanceTimersByTime(50)
      throttled('second')
      vi.advanceTimersByTime(50)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('second')

      vi.useRealTimers()
    })

    it('waits a full wait period before the next trailing call', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { leading: false })

      throttled('first')
      vi.advanceTimersByTime(100)
      expect(spy).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1000)

      throttled('second')
      vi.advanceTimersByTime(99)
      expect(spy).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1)
      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith('second')

      vi.useRealTimers()
    })
  })

  describe('with { trailing: false }', () => {
    it('calls the function immediately on first invocation', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { trailing: false })

      throttled('first')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })

    it('drops calls made during the wait period', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { trailing: false })

      throttled('first')
      throttled('second')
      throttled('third')

      expect(spy).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('first')

      vi.useRealTimers()
    })

    it('allows a new leading call after the wait period has elapsed', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, { trailing: false })

      throttled('first')
      vi.advanceTimersByTime(100)
      throttled('second')

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenLastCalledWith('second')

      vi.useRealTimers()
    })
  })

  describe('with { leading: false, trailing: false }', () => {
    it('never calls the function', () => {
      vi.useFakeTimers()

      const spy = vi.fn()
      const throttled = throttle(spy, 100, {
        leading: false,
        trailing: false,
      })

      throttled()
      vi.advanceTimersByTime(100)

      throttled()
      vi.advanceTimersByTime(1000)

      throttled()
      vi.advanceTimersByTime(1000)

      expect(spy).toHaveBeenCalledTimes(0)

      vi.useRealTimers()
    })
  })
})
