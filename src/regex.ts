import { once } from './once'

/**
 * Checks if the browser supports [regex lookbehind assertion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Lookbehind_assertion).
 */
export const canUseRegexLookbehind: () => boolean = /** @__PURE__ */ once(
  () => {
    try {
      return 'ab'.replace(new RegExp('(?<=a)b', 'g'), 'c') === 'ac'
    } catch {
      return false
    }
  },
)
