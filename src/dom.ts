import { isObject } from './checker'

/**
 * @internal
 */
enum NodeType {
  ELEMENT_NODE = 1 satisfies typeof Node.ELEMENT_NODE,
  ATTRIBUTE_NODE = 2 satisfies typeof Node.ATTRIBUTE_NODE,
  TEXT_NODE = 3 satisfies typeof Node.TEXT_NODE,
  CDATA_SECTION_NODE = 4 satisfies typeof Node.CDATA_SECTION_NODE,
  ENTITY_REFERENCE_NODE = 5 satisfies typeof Node.ENTITY_REFERENCE_NODE,
  ENTITY_NODE = 6 satisfies typeof Node.ENTITY_NODE,
  PROCESSING_INSTRUCTION_NODE = 7 satisfies typeof Node.PROCESSING_INSTRUCTION_NODE,
  COMMENT_NODE = 8 satisfies typeof Node.COMMENT_NODE,
  DOCUMENT_NODE = 9 satisfies typeof Node.DOCUMENT_NODE,
  DOCUMENT_TYPE_NODE = 10 satisfies typeof Node.DOCUMENT_TYPE_NODE,
  DOCUMENT_FRAGMENT_NODE = 11 satisfies typeof Node.DOCUMENT_FRAGMENT_NODE,
  NOTATION_NODE = 12 satisfies typeof Node.NOTATION_NODE,
}

/**
 * Checks if the given DOM node is an Element.
 */
export function isElement(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE
}

/**
 * Checks if the given DOM node is a Text node.
 */
export function isTextNode(node: Node): node is Text {
  return node.nodeType === NodeType.TEXT_NODE
}

/**
 * Checks if the given DOM node is an HTMLElement.
 */
export function isHTMLElement(node: Node): node is HTMLElement {
  return isElement(node) && node.namespaceURI === 'http://www.w3.org/1999/xhtml'
}

/**
 * Checks if the given DOM node is an SVGElement.
 */
export function isSVGElement(node: Node): node is SVGElement {
  return isElement(node) && node.namespaceURI === 'http://www.w3.org/2000/svg'
}

/**
 * Checks if the given DOM node is an MathMLElement.
 */
export function isMathMLElement(node: Node): node is MathMLElement {
  return (
    isElement(node) &&
    node.namespaceURI === 'http://www.w3.org/1998/Math/MathML'
  )
}

/**
 * Checks if the given DOM node is a Document.
 */
export function isDocument(node: Node): node is Document {
  return node.nodeType === NodeType.DOCUMENT_NODE
}

/**
 * Checks if the given DOM node is a DocumentFragment.
 */
export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE
}

/**
 * Checks if the given DOM node is a ShadowRoot.
 */
export function isShadowRoot(node: Node): node is ShadowRoot {
  return isDocumentFragment(node) && 'host' in node && isElementLike(node.host)
}

/**
 * Checks if an unknown value is likely a DOM node.
 */
export function isNodeLike(value: unknown): value is Node {
  return isObject(value) && value.nodeType !== undefined
}

/**
 * Checks if an unknown value is likely a DOM element.
 */
export function isElementLike(value: unknown): value is Element {
  return (
    isObject(value) &&
    value.nodeType === NodeType.ELEMENT_NODE &&
    typeof value.nodeName === 'string'
  )
}

/**
 * Checks if the given value is likely a Window object.
 */
export function isWindowLike(value: unknown): value is Window {
  return isObject(value) && value.window === value
}

/**
 * Gets the window object for the given target or the global window object if no
 * target is provided.
 */
export function getWindow(
  target?: Node | ShadowRoot | Document | null,
): Window & typeof globalThis {
  if (target) {
    if (isShadowRoot(target)) {
      return getWindow(target.host)
    }
    if (isDocument(target)) {
      return target.defaultView || window
    }
    if (isElement(target)) {
      return target.ownerDocument?.defaultView || window
    }
  }
  return window
}

/**
 * Gets the document for the given target or the global document if no target is
 * provided.
 */
export function getDocument(
  target?: Element | Window | Node | Document | null,
): Document {
  if (target) {
    if (isWindowLike(target)) {
      return target.document
    }
    if (isDocument(target)) {
      return target
    }
    return target.ownerDocument || document
  }
  return document
}

/**
 * Gets a reference to the root node of the document based on the given target.
 */
export function getDocumentElement(
  target?: Element | Node | Window | Document | null,
): HTMLElement {
  return getDocument(target).documentElement
}
