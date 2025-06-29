export class AccessDeniedError extends Error {
  status: number
  constructor() {
    super('Access denied')
    this.name = 'AccessDeniedError'
    this.status = 403
  }
}
