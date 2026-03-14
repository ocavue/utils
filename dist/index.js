function isObject(value) {
	return typeof value == "object" && !!value;
}
function isMap(value) {
	return value instanceof Map;
}
function isSet(value) {
	return value instanceof Set;
}
function isNotNullish(value) {
	return value != null;
}
var Counter = class extends Map {
	constructor(iterable) {
		super(iterable);
	}
	get(key) {
		return super.get(key) ?? 0;
	}
	increment(key, amount = 1) {
		this.set(key, this.get(key) + amount);
	}
	decrement(key, amount = 1) {
		this.set(key, this.get(key) - amount);
	}
}, WeakCounter = class extends WeakMap {
	constructor(entries) {
		super(entries);
	}
	get(key) {
		return super.get(key) ?? 0;
	}
	increment(key, amount = 1) {
		this.set(key, this.get(key) + amount);
	}
	decrement(key, amount = 1) {
		this.set(key, this.get(key) - amount);
	}
}, DefaultMap = class extends Map {
	constructor(defaultFactory, iterable) {
		super(iterable), this.defaultFactory = defaultFactory;
	}
	get(key) {
		if (this.has(key)) return super.get(key);
		let value = this.defaultFactory();
		return this.set(key, value), value;
	}
}, DefaultWeakMap = class extends WeakMap {
	constructor(defaultFactory, entries) {
		super(entries), this.defaultFactory = defaultFactory;
	}
	get(key) {
		if (this.has(key)) return super.get(key);
		let value = this.defaultFactory();
		return this.set(key, value), value;
	}
};
function isElement(node) {
	return node.nodeType === 1;
}
function isTextNode(node) {
	return node.nodeType === 3;
}
function isHTMLElement(node) {
	return isElement(node) && node.namespaceURI === "http://www.w3.org/1999/xhtml";
}
function isSVGElement(node) {
	return isElement(node) && node.namespaceURI === "http://www.w3.org/2000/svg";
}
function isMathMLElement(node) {
	return isElement(node) && node.namespaceURI === "http://www.w3.org/1998/Math/MathML";
}
function isDocument(node) {
	return node.nodeType === 9;
}
function isDocumentFragment(node) {
	return node.nodeType === 11;
}
function isShadowRoot(node) {
	return isDocumentFragment(node) && "host" in node && isElementLike(node.host);
}
function isNodeLike(value) {
	return isObject(value) && value.nodeType !== void 0;
}
function isElementLike(value) {
	return isObject(value) && value.nodeType === 1 && typeof value.nodeName == "string";
}
function isWindowLike(value) {
	return isObject(value) && value.window === value;
}
function getWindow(target) {
	if (target) {
		if (isShadowRoot(target)) return getWindow(target.host);
		if (isDocument(target)) return target.defaultView || window;
		if (isElement(target)) return target.ownerDocument?.defaultView || window;
	}
	return window;
}
function getDocument(target) {
	return target ? isWindowLike(target) ? target.document : isDocument(target) ? target : target.ownerDocument || document : document;
}
function getDocumentElement(target) {
	return getDocument(target).documentElement;
}
function formatBytes(bytes) {
	let units = [
		"B",
		"KB",
		"MB",
		"GB"
	], unitIndex = 0, num = bytes;
	for (; Math.abs(num) >= 1024 && unitIndex < units.length - 1;) num /= 1024, unitIndex++;
	let fraction = unitIndex === 0 && num % 1 == 0 ? 0 : 1;
	return `${num.toFixed(fraction)}${units[unitIndex]}`;
}
let id = 0, maxSafeInteger = 2 ** 53 - 1;
function getId() {
	return id++, id >= maxSafeInteger && (id = 1), id;
}
function isDeepEqual(a, b) {
	if (a === b) return !0;
	if (a == null || b == null) return !1;
	let aType = typeof a;
	if (aType !== typeof b) return !1;
	if (aType === "number" && Number.isNaN(a) && Number.isNaN(b)) return !0;
	if (Array.isArray(a)) {
		if (!Array.isArray(b) || a.length !== b.length) return !1;
		let size = a.length;
		for (let i = 0; i < size; i++) if (!isDeepEqual(a[i], b[i])) return !1;
		return !0;
	}
	if (isSet(a)) {
		if (!isSet(b) || a.size !== b.size) return !1;
		for (let value of a) if (!b.has(value)) return !1;
		return !0;
	}
	if (isMap(a)) {
		if (!isMap(b) || a.size !== b.size) return !1;
		for (let key of a.keys()) if (!b.has(key) || !isDeepEqual(a.get(key), b.get(key))) return !1;
		return !0;
	}
	if (typeof a == "object" && typeof b == "object") {
		let aKeys = Object.keys(a), bKeys = Object.keys(b);
		if (aKeys.length !== bKeys.length) return !1;
		for (let key of aKeys) if (!isDeepEqual(a[key], b[key])) return !1;
		return !0;
	}
	return !1;
}
function mapGroupByPolyfill(items, keySelector) {
	let map = /* @__PURE__ */ new Map(), index = 0;
	for (let item of items) {
		let key = keySelector(item, index), group = map.get(key);
		group ? group.push(item) : map.set(key, [item]), index++;
	}
	return map;
}
function mapGroupBy(items, keySelector) {
	return Map.groupBy ? Map.groupBy(items, keySelector) : mapGroupByPolyfill(items, keySelector);
}
function mapValues(object, callback) {
	let result = {};
	for (let [key, value] of Object.entries(object)) result[key] = callback(value, key);
	return result;
}
function objectEntries(obj) {
	return Object.entries(obj);
}
function objectGroupByPolyfill(items, keySelector) {
	let result = {}, index = 0;
	for (let item of items) {
		let key = keySelector(item, index), group = result[key];
		group ? group.push(item) : result[key] = [item], index++;
	}
	return result;
}
function objectGroupBy(items, keySelector) {
	return Object.groupBy ? Object.groupBy(items, keySelector) : objectGroupByPolyfill(items, keySelector);
}
function once(fn) {
	let called = !1, result;
	return () => (called || (result = fn(), called = !0, fn = void 0), result);
}
const supportsRegexLookbehind = /* @__PURE__ */ once(() => {
	try {
		return "ab".replaceAll(/* @__PURE__ */ RegExp("(?<=a)b", "g"), "c") === "ac";
	} catch {
		/* v8 ignore start */
		return !1;
	}
});
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function throttle(callback, wait) {
	let timeoutId, lastCallTime = 0;
	return function(...args) {
		clearTimeout(timeoutId);
		let now = Date.now(), delay = wait + lastCallTime - now;
		delay <= 0 ? (lastCallTime = now, callback.apply(this, args)) : timeoutId = setTimeout(() => {
			lastCallTime = Date.now(), callback.apply(this, args);
		}, delay);
	};
}
export { Counter, DefaultMap, DefaultWeakMap, WeakCounter, formatBytes, getDocument, getDocumentElement, getId, getWindow, isDeepEqual, isDocument, isDocumentFragment, isElement, isElementLike, isHTMLElement, isMap, isMathMLElement, isNodeLike, isNotNullish, isObject, isSVGElement, isSet, isShadowRoot, isTextNode, isWindowLike, mapGroupBy, mapValues, objectEntries, objectGroupBy, once, sleep, supportsRegexLookbehind, throttle };

//# sourceMappingURL=index.js.map