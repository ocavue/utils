import { once } from './once'

/**
 * Checks if current environment supports [regex lookbehind assertion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Lookbehind_assertion).
 */
export const supportsRegexLookbehind: () => boolean = /* @__PURE__ */ once(
  () => {
    try {
      return 'ab'.replace(new RegExp('(?<=a)b', 'g'), 'c') === 'ac'
    } catch {
      return false
    }
  },
)
