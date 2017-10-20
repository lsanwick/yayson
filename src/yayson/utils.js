// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const find = (arr, callback) => {
  for (let elem of Array.from(arr)) {
    if (callback(elem)) {
      return elem
    }
  }
  return undefined
}

export default {
  find,
  filter: (arr, callback) => {
    const res = []
    for (let elem of Array.from(arr)) {
      if (callback(elem)) {
        res.push(elem)
      }
    }
    return res
  },
  values: obj => {
    if (obj == null) {
      obj = {}
    }
    return Object.values(obj)
  },
  clone: obj => {
    if (obj == null) {
      obj = {}
    }
    return { ...obj }
  },
  any: (arr, callback) => find(arr, callback) != null,
  // stolen from https://github.com/kriskowal/q
  isPromise: obj =>
    obj === Object(obj) &&
    typeof obj.promiseDispatch === 'function' &&
    typeof obj.inspect === 'function',
}
