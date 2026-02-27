export class NotImplementedError extends Error {
  readonly code = 'NOT_IMPLEMENTED'
  readonly operation: string

  constructor(operation: string) {
    super(`${operation} is not implemented yet.`)
    this.name = 'NotImplementedError'
    this.operation = operation
  }
}

export * from './popbill-error'
