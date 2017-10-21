// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { expect } from 'chai'

import utils from '../../src/yayson/utils'

const testUtils = function(utils) {
  it('should find element', function() {
    const num = utils.find([1, 2, 3], n => n === 2)

    return expect(num).to.equal(2)
  })

  it('should not find element', function() {
    const num = utils.find([1, 2, 3], n => n === 8)

    return expect(num).to.equal(undefined)
  })

  it('should filter values', function() {
    const evens = utils.filter([1, 2, 3, 4], n => n % 2 === 0)

    return expect(evens).to.deep.equal([2, 4])
  })

  it('should evaluate if any element', function() {
    const anyEvens = utils.any([1, 2, 3, 4], n => n % 2 === 0)

    return expect(anyEvens).to.be.true
  })

  return it('should parse object values', function() {
    const obj = { a: 1, b: 2 }
    const values = utils.values(obj)

    return expect(values).to.deep.equal([1, 2])
  })
}

describe('utils without optional dependencies', function() {
  return testUtils(utils)
})
