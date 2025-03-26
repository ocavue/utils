// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'

import {
  isElement,
  isElementLike,
  isHTMLElement,
  isMathMLElement,
  isSVGElement,
  isTextNode,
} from './dom'

describe('isElement', () => {
  it('can be used to check if a node is an element', () => {
    const div = document.createElement('div')
    expect(isElement(div)).toBe(true)
  })
})

describe('isTextNode', () => {
  it('can be used to check if a node is a text node', () => {
    const text = document.createTextNode('Hello, world!')
    expect(isTextNode(text)).toBe(true)
  })
})

describe('isHTMLElement', () => {
  it('can be used to check if a node is an HTML element', () => {
    const div = document.createElement('div')
    expect(isHTMLElement(div)).toBe(true)
  })
})

describe('isSVGElement', () => {
  it('can be used to check if a node is an SVG element', () => {
    const div = document.createElement('div')
    div.innerHTML = `<svg><rect width="200" height="100" x="10" y="10" rx="20" ry="20" fill="blue" /></svg>`
    expect(isSVGElement(div.firstChild!)).toBe(true)
  })

  it('returns false for non-SVG elements', () => {
    const div = document.createElement('div')
    expect(isSVGElement(div)).toBe(false)
  })
})

describe('isMathMLElement', () => {
  it('can be used to check if a node is a MathML element', () => {
    const div = document.createElement('div')
    div.innerHTML = `<math><mn>1</mn><mo>+</mo><mn>2</mn><mo>+</mo><mn>3</mn></math>`
    expect(isMathMLElement(div.firstChild!)).toBe(true)
  })

  it('returns false for non-MathML elements', () => {
    const div = document.createElement('div')
    expect(isMathMLElement(div)).toBe(false)
  })
})

describe('isElementLike', () => {
  it('returns true for HTML elements', () => {
    const div = document.createElement('div')
    expect(isElementLike(div)).toBe(true)
  })

  it('returns true for SVG elements', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    expect(isElementLike(svg)).toBe(true)
  })

  it('returns false for text nodes', () => {
    const text = document.createTextNode('text')
    expect(isElementLike(text)).toBe(false)
  })

  it('returns false for non-node values', () => {
    expect(isElementLike({})).toBe(false)
    expect(isElementLike(null)).toBe(false)
    expect(isElementLike(undefined)).toBe(false)
    expect(isElementLike('string')).toBe(false)
    expect(isElementLike(123)).toBe(false)
    expect(isElementLike(true)).toBe(false)
    expect(isElementLike(() => 123)).toBe(false)
  })
})
