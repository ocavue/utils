import { once } from './once'

function fn1() {
  console.log('fn1')
}

const once1 = once(fn1)

function fn2() {
  console.log('fn2')
}

export { once1, fn2 }
