export class AuthError extends Error {
  constructor(message: string = 'AuthError') {
    super(message)
    this.name = 'AuthError'
  }
}
export class ForbiddenError extends Error {
  constructor(message: string = 'ForbiddenError') {
    super(message)
    this.name = 'ForbiddenError'
  }
}
export class NotFoundError extends Error {
  constructor(message: string = 'NotFoundError') {
    super(message)
    this.name = 'NotFoundError'
  }
}
