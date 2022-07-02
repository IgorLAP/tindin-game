export class InvalidSchemaError extends Error {
  constructor() {
    super('Parameters don\'t match the types')
    this.name = 'InvalidSchemaError'
  }
}
