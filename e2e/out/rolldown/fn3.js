//#region ../dist/index.js
let id = 0, maxSafeInteger = 2 ** 53 - 1;
function mapGroupByPolyfill(items, keySelector) {
	let map = /* @__PURE__ */ new Map(), index = 0;
	for (let item of items) {
		let key = keySelector(item, index), group = map.get(key);
		group ? group.push(item) : map.set(key, [item]), index++;
	}
	return map;
}
function mapGroupByNative(items, keySelector) {
	return Map.groupBy(items, keySelector);
}
const mapGroupBy = Map.groupBy ? mapGroupByNative : mapGroupByPolyfill;
function objectGroupByPolyfill(items, keySelector) {
	let result = {}, index = 0;
	for (let item of items) {
		let key = keySelector(item, index), group = result[key];
		group ? group.push(item) : result[key] = [item], index++;
	}
	return result;
}
function objectGroupByNative(items, keySelector) {
	return Object.groupBy(items, keySelector);
}
const objectGroupBy = Object.groupBy ? objectGroupByNative : objectGroupByPolyfill;
function once(fn) {
	let called = !1, result;
	return () => (called || (result = fn(), called = !0, fn = void 0), result);
}

//#endregion
//#region src/stub-once.js
function fn2() {
	console.log("function_2");
}
once(fn2);
function fn3() {
	console.log("function_3");
}
const once3 = once(fn3);

//#endregion
export { fn3 };