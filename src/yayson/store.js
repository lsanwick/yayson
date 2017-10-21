// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import utils from './utils'
import Record from './Record'

export default class Store {
  constructor() {
    this.reset()
  }

  reset() {
    this.records = []
    this.relations = {}
  }

  toModel(rec, type, models) {
    let model = {
      ...rec.attributes,
      id: rec.id,
      type: rec.type,
    }

    if (!models[type]) {
      models[type] = {}
    }
    if (!models[type][rec.id]) {
      models[type][rec.id] = model
    }

    if (model.hasOwnProperty('meta')) {
      const { meta, ...rest } = model
      model = {
        ...rest,
        attributes: {
          meta,
        },
      }
    }

    if (rec.meta) {
      model.meta = rec.meta
    }

    if (rec.links) {
      model.links = rec.links
    }

    if (rec.relationships) {
      for (let key in rec.relationships) {
        const { data, links, meta } = rec.relationships[key]

        model[key] = null
        if (!data && !links) {
          continue
        }
        const resolve = ({ type, id }) => this.find(type, id, models)

        model[key] = data instanceof Array ? data.map(resolve) : data ? resolve(data) : {}

        // Model of the relation
        const currentModel = model[key]

        if (currentModel) {
          // retain the links and meta from the relationship entry
          // use as underscore property name because the currentModel may also have a link and meta reference
          currentModel._links = links || {}
          currentModel._meta = meta || {}
        }
      }
    }

    return model
  }

  findRecord(type, id) {
    return utils.find(this.records, r => r.type === type && r.id === id)
  }

  findRecords(type) {
    return utils.filter(this.records, r => r.type === type)
  }

  find(type, id, models = {}) {
    const rec = this.findRecord(type, id)
    if (!rec) {
      return null
    }
    models[type] = models[type] || {}
    return models[type][id] || this.toModel(rec, type, models)
  }

  findAll(type, models = {}) {
    const recs = this.findRecords(type)
    if (!recs) {
      return []
    }
    recs.forEach(rec => {
      models[type] = models[type] || {}
      return this.toModel(rec, type, models)
    })
    return utils.values(models[type])
  }

  remove(type, id) {
    const removeRecord = record => {
      const index = this.records.indexOf(record)
      if (index > -1) {
        return this.records.splice(index, 1)
      }
    }

    if (id) {
      return removeRecord(this.findRecord(type, id))
    }

    return this.findRecords(type).map(removeRecord)
  }

  sync(body) {
    const sync = data => {
      if (!data) {
        return null
      }

      const add = obj => {
        const { type, id } = obj
        this.remove(type, id)
        const rec = new Record(obj)
        this.records.push(rec)
        return rec
      }

      if (data instanceof Array) {
        return data.map(add)
      } else {
        return add(data)
      }
    }

    sync(body.included)
    const recs = sync(body.data)

    if (!recs) {
      return null
    }

    const models = {}
    let result = null

    if (recs instanceof Array) {
      result = recs.map(rec => {
        return this.toModel(rec, rec.type, models)
      })
    } else {
      result = this.toModel(recs, recs.type, models)
    }

    if (body.hasOwnProperty('links')) {
      result.links = body.links
    }

    if (body.hasOwnProperty('meta')) {
      result.meta = body.meta
    }

    return result
  }
}
