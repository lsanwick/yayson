export default class Record {
  constructor({ id, type, attributes, relationships, links, meta }) {
    this.id = id
    this.type = type
    this.attributes = attributes
    this.relationships = relationships
    this.links = links
    this.meta = meta
  }
}
