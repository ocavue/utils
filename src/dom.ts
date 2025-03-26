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

export function isElement(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE
}

export function isTextNode(node: Node): node is Text {
  return node.nodeType === NodeType.TEXT_NODE
}

export function isHTMLElement(node: Node): node is HTMLElement {
  return isElement(node) && node.namespaceURI === 'http://www.w3.org/1999/xhtml'
}

export function isSVGElement(node: Node): node is SVGElement {
  return isElement(node) && node.namespaceURI === 'http://www.w3.org/2000/svg'
}

export function isMathMLElement(node: Node): node is MathMLElement {
  return (
    isElement(node) &&
    node.namespaceURI === 'http://www.w3.org/1998/Math/MathML'
  )
}
