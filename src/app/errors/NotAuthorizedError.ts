export class NotAuthorizedError extends Error {
  constructor() {
    super('You don\'t have permission')
    this.name = 'NotAuthorizedError'
  }
}
