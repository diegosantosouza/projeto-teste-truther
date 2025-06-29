export class EmailInUseError extends Error {
  status: number
  constructor() {
    super(`The email is already in use`)
    this.name = 'EmailInUseError'
    this.status = 409
  }
}
