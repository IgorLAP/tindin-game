export class InvalidEmailOrPasswordError extends Error {
  constructor() {
    super('Email or password incorrect')
    this.name = 'InvalidEmailOrPasswordError'
  }
}
