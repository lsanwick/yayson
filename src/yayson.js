// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import Store from './yayson/store'
import Adapter from './yayson/adapter'
import adapters from './yayson/adapters'
import presenterFactory from './yayson/presenter'

const lookupAdapter = function(nameOrAdapter) {
  if (nameOrAdapter === 'default') {
    return Adapter
  }
  return adapters[nameOrAdapter] || nameOrAdapter || Adapter
}

const presenter = (options = {}) => presenterFactory(lookupAdapter(options.adapter))

export default function(param = {}) {
  const { adapter } = param
  return {
    Store,
    Presenter: presenter({ adapter }),
    Adapter,
  }
}
