import utils from './utils'

function buildLinks(link) {
  if (link == null) {
    return
  }
  if (link.self != null || link.related != null) {
    return link
  } else {
    return { self: link }
  }
}

export default function(adapter) {
  const Presenter = class Presenter {
    adapter = adapter
    static type = 'objects'

    static toJSON() {
      return new this().toJSON(...arguments)
    }

    static render() {
      return new this().render(...arguments)
    }

    constructor(scope) {
      if (scope == null) {
        scope = {}
      }
      this.scope = scope
    }

    id = instance => this.adapter.id(instance)

    selfLinks() {}

    links() {}

    relationships() {}

    attributes(instance) {
      if (!instance) {
        return null
      }

      const { id, type, ...attributes } = this.adapter.get(instance)

      const relationships = this.relationships()
      for (let key in relationships) {
        delete attributes[key]
      }
      return attributes
    }

    includeRelationships(scope, instance) {
      const relationships = this.relationships()
      const result = []
      for (var key in relationships) {
        const factory = relationships[key]
        if (!factory) {
          throw new Error(`Presenter for ${key} in ${this.constructor.type} is not defined`)
        }
        const presenter = new factory(scope)

        const data = this.adapter.get(instance, key)
        if (data) {
          result.push(presenter.toJSON(data, { include: true }))
        }
      }
    }

    buildRelationships(instance) {
      if (!instance) {
        return null
      }
      const rels = this.relationships()
      const links = this.links(instance) || {}
      let relationships = null
      for (var key in rels) {
        let data = this.adapter.get(instance, key)
        var presenter = rels[key]
        const buildData = d => ({
          id: this.adapter.id(d),
          type: presenter.type,
        })
        const build = d => {
          const rel = {}
          if (d) {
            rel.data = buildData(d)
          }
          if (links[key]) {
            rel.links = buildLinks(links[key])
          } else if (!d) {
            rel.data = null
          }
          return rel
        }
        if (!relationships) {
          relationships = {}
        }
        relationships = relationships || {}
        relationships[key] = relationships[key] || {}
        if (data instanceof Array) {
          relationships[key].data = data.map(buildData)
          if (links[key]) {
            relationships[key].links = buildLinks(links[key])
          }
        } else {
          relationships[key] = build(data)
        }
      }
      return relationships
    }

    buildSelfLink(instance) {
      return buildLinks(this.selfLinks(instance))
    }

    toJSON(instanceOrCollection, options = {}) {
      if (options.meta) {
        this.scope.meta = options.meta
      }
      if (!this.scope.data) {
        this.scope.data = null
      }

      if (!instanceOrCollection) {
        return this.scope
      }

      if (instanceOrCollection instanceof Array) {
        const collection = instanceOrCollection
        this.scope.data = this.scope.data || []
        collection.forEach(instance => this.toJSON(instance, options))
      } else {
        const instance = instanceOrCollection
        let added = true
        const model = {
          type: this.constructor.type,
          attributes: this.attributes(instance),
        }
        const id = this.id(instance)
        const relationships = this.buildRelationships(instance)
        const links = this.buildSelfLink(instance)
        if (id) {
          model.id = id
        }
        if (relationships) {
          model.relationships = relationships
        }
        if (links) {
          model.links = links
        }

        if (options.include) {
          this.scope.included = this.scope.included || []
          if (
            !utils.any(
              this.scope.included.concat(this.scope.data),
              i => i.id === model.id && i.type === model.type
            )
          ) {
            this.scope.included.push(model)
          } else {
            added = false
          }
        } else if (this.scope.data) {
          if (
            !(this.scope.data instanceof Array) ||
            !utils.any(this.scope.data, i => i.id === model.id)
          ) {
            this.scope.data.push(model)
          } else {
            added = false
          }
        } else {
          this.scope.data = model
        }

        if (added) {
          this.includeRelationships(this.scope, instance)
        }
      }
      return this.scope
    }

    render(instanceOrCollection, options) {
      return utils.isPromise(instanceOrCollection)
        ? instanceOrCollection.then(data => this.toJSON(data, options))
        : this.toJSON(instanceOrCollection, options)
    }
  }

  return Presenter
}
