// A function that is wrapped by `once()`, but the wrapper is not exported
function fn2() {
  console.log('function_2');
}

export { fn2 };
