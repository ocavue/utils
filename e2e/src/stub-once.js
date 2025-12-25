  import { once } from '@ocavue/utils'

// A function that is not wrapped by `once()`
export function fn1() {
  console.log('function_1')
}

// A function that is wrapped by `once()`, but the wrapper is not exported
export function fn2() {
  console.log('function_2')
}

const once2 = once(fn2)

// A function that is wrapped by `once()`, and the wrapper is exported
export function fn3() {
  console.log('function_3')
}

export const once3 = once(fn3)

// A function that is wrapped by `once()`, but the wrapper is marked as `__PURE__`
export function fn4() {
  console.log('function_4')
}

export const once4 = /* @__PURE__ */ once(fn4)
